import { Component, type ErrorInfo, type ReactNode } from "react";
import { logError } from "@/lib/logger";

type ErrorBoundaryProps = {
  children: ReactNode;
  componentName?: string;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logError(
      error,
      {
        channel: "react.errorBoundary",
        componentStack: errorInfo.componentStack,
      },
      this.props.componentName ?? "ErrorBoundary"
    );
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;