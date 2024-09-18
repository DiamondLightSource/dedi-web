import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app.tsx";
import "./index.css";
import { ErrorBoundary } from "react-error-boundary";
import AppErrorFallBack from "./utils/errorComponants.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary
      fallback={<AppErrorFallBack message="Something went wrong" />}
    >
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
