import { Component, type ErrorInfo, type ReactNode } from "react";
import { useSnackbar } from "../../context/useSnackbar";

interface ErrorBoundaryProps {
  children: ReactNode;
  onError: (error: Error) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Application error:", error, errorInfo);
    this.props.onError(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="grid min-h-screen place-items-center px-6 text-center text-zinc-400">
          <p>The dashboard encountered an error. Reload to try again.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function GlobalErrorBoundary({ children }: { children: ReactNode }) {
  const { showSnackbar } = useSnackbar();
  return (
    <ErrorBoundary onError={(error) => showSnackbar(error.message, "error", 5000)}>
      {children}
    </ErrorBoundary>
  );
}

