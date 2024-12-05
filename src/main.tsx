import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import ResumePage from "./index.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ResumePage />
  </StrictMode>
);
