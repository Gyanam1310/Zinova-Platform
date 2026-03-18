import { logApiCall, logError } from "@/lib/logger";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
const isDev = import.meta.env.DEV;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function createMockResponse(path, requestConfig) {
  if (path === "/auth/login") {
    return {
      ok: true,
      status: 200,
      data: {
        token: "mock-token",
        user: { id: "dev-user" },
      },
    };
  }

  return {
    ok: true,
    status: 200,
    data: {
      id: crypto.randomUUID(),
      path,
      requestConfig,
      message: "Request accepted",
    },
  };
}

async function request(path, options = {}) {
  const requestConfig = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: options.body,
  };

  const endpoint = `${API_BASE_URL}${path}`;
  logApiCall(endpoint, "START", { method: requestConfig.method }, "ApiService");

  try {
    const response = await fetch(endpoint, requestConfig);
    let responseData = null;

    try {
      responseData = await response.json();
    } catch {
      responseData = null;
    }

    if (!response.ok) {
      const apiError = new Error(
        (responseData && responseData.message) || `Request failed with status ${response.status}`
      );
      apiError.status = response.status;
      throw apiError;
    }

    logApiCall(
      endpoint,
      "SUCCESS",
      { method: requestConfig.method, status: response.status },
      "ApiService"
    );

    return {
      ok: true,
      status: response.status,
      data: responseData,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    logApiCall(
      endpoint,
      "FAILED",
      { method: requestConfig.method, error: errorMessage },
      "ApiService"
    );
    logError(error, { endpoint, method: requestConfig.method }, "ApiService");

    if (isDev) {
      await wait(800);
      const mockResponse = createMockResponse(path, requestConfig);

      logApiCall(
        endpoint,
        "SUCCESS",
        { method: requestConfig.method, status: mockResponse.status, fallback: true },
        "ApiService"
      );

      return mockResponse;
    }

    throw error;
  }
}

export async function submitLead(payload) {
  return request("/leads", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function trackInteraction(payload) {
  return request("/interactions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function login(payload) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
