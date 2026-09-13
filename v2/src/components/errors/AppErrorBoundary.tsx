import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  failed: boolean;
}

/**
 * Catches any uncaught React render errors and shows a friendly fallback
 * instead of a white screen. Logs to the console for debugging.
 */
export class AppErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[garden] uncaught render error", error, info.componentStack);
  }

  render() {
    if (this.state.failed) {
      return (
        <main className="app-error">
          <span aria-hidden="true">🌸</span>

          <h1>El jardín tuvo un pequeño problema.</h1>

          <p>Algo no salió como esperábamos.</p>

          <button
            type="button"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            Volver al jardín
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}
