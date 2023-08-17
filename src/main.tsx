import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app.tsx";
import BasicAppBar from './components/basicAppBar.tsx';
import "./index.css";
import { Box } from "@mui/material";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Box sx={{ Height: '100vh' }} >
      <BasicAppBar />
      <App />
    </Box>
  </React.StrictMode >,
);
