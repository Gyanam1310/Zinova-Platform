import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormCard } from "@/components/forms/FormCard";
import { FormInput } from "@/components/forms/FormInput";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { login } from "@/services/api";
import * as logger from "@/lib/logger";

type LoginResponse = {
  token?: string;
  accessToken?: string;
  userId?: string | number;
  user?: {
    id?: string | number;
  };
  data?: {
    token?: string;
    accessToken?: string;
    userId?: string | number;
    user?: {
      id?: string | number;
    };
  };
};

const AUTH_TOKEN_KEY = "authToken";

function getToken(response: LoginResponse): string | undefined {
  return (
    response.token ??
    response.accessToken ??
    response.data?.token ??
    response.data?.accessToken
  );
}

function getUserId(response: LoginResponse): string | number | undefined {
  return (
    response.userId ??
    response.user?.id ??
    response.data?.userId ??
    response.data?.user?.id
  );
}

function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object") {
    const maybeError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    if (maybeError.response?.data?.message) {
      return maybeError.response.data.message;
    }

    if (maybeError.message) {
      return maybeError.message;
    }
  }

  return "Unable to sign in right now. Please check your credentials and try again.";
}

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    setError(null);
    setLoading(true);

    logger.logEvent({
      action: "LOGIN_ATTEMPT",
      component: "Login",
      metadata: {
        email: normalizedEmail,
      },
    });

    try {
      const response = (await login({
        email: normalizedEmail,
        password,
      })) as LoginResponse;

      const token = getToken(response);
      const userId = getUserId(response);

      if (!token) {
        throw new Error("Authentication token missing from login response.");
      }

      localStorage.setItem(AUTH_TOKEN_KEY, token);

      logger.logEvent({
        action: "LOGIN_SUCCESS",
        component: "Login",
        metadata: {
          email: normalizedEmail,
          userId,
        },
      });

      navigate("/dashboard", { replace: true });
    } catch (submitError) {
      const errorMessage = getErrorMessage(submitError);

      logger.logEvent({
        action: "LOGIN_FAILED",
        component: "Login",
        metadata: {
          email: normalizedEmail,
          errorMessage,
        },
      });

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md items-center justify-center">
        <FormCard>
          <div className="w-full space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Sign in</h1>
              <p className="text-sm text-slate-600">Access your Zinova account</p>
            </div>

            {error ? (
              <div
                className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                role="alert"
              >
                {error}
              </div>
            ) : null}

            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              <FormInput
                id="email"
                name="email"
                type="email"
                label="Email"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                autoComplete="email"
                required
                disabled={loading}
              />

              <FormInput
                id="password"
                name="password"
                type="password"
                label="Password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                disabled={loading}
              />

              <SubmitButton type="submit" loading={loading} disabled={loading} className="w-full">
                Sign in
              </SubmitButton>
            </form>
          </div>
        </FormCard>
      </div>
    </div>
  );
};

export default Login;
