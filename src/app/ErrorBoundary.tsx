import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Application render error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-10">
          <section
            aria-labelledby="application-error-heading"
            className="w-full max-w-lg space-y-4 rounded border border-slate-200 bg-white p-6 text-center shadow-sm"
            role="alert"
          >
            <h1 className="text-xl font-semibold text-slate-900" id="application-error-heading">
              Something went wrong
            </h1>
            <p className="text-sm text-slate-600">
              The page hit an unexpected error. You can try rendering it again.
            </p>
            <button
              className="min-h-10 rounded bg-emerald-800 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-900"
              onClick={() => this.setState({ hasError: false })}
              type="button"
            >
              Try again
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
