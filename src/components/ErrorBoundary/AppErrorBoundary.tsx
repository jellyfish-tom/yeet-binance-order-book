import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";

type AppErrorBoundaryProps = {
  children: ReactNode;
};

type AppErrorBoundaryState = {
  hasError: boolean;
};

export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  override state: AppErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return {
      hasError: true,
    };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Unhandled application error", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  override render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <main className="ob-text-primary flex min-h-screen items-center justify-center bg-(--app-bg) px-4">
        <section className="ob-elevated-card p-6">
          <p className="ob-text-overline ob-text-tertiary">Application Error</p>
          <h1 className="mt-3 text-[24px] font-semibold leading-[30px] text-(--text-primary)">
            Something went wrong while rendering the order book.
          </h1>
          <p className="ob-text-body-md ob-text-secondary mt-3">
            Try reloading the page. If the problem continues, check the browser
            console for the captured error.
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className="mt-6 inline-flex h-10 items-center justify-center rounded-[8px] bg-(--coin-accent) px-4 text-[14px] font-medium text-(--surface-contrast) transition-opacity hover:opacity-90"
          >
            Reload App
          </button>
        </section>
      </main>
    );
  }
}
