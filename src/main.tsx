import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app.tsx";
import "./index.css";
import { ErrorBoundary } from "react-error-boundary";
import AppErrorFallBack from "./utils/errorComponents.tsx";

function logError(error: Error, info: React.ErrorInfo) {
  console.error("[ErrorBoundary] Uncaught error:", error);
  console.error("[ErrorBoundary] Component stack:", info.componentStack);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={AppErrorFallBack} onError={logError}>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
