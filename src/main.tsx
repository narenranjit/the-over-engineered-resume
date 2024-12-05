import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ResumePage from "./app/ResumeApp.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ResumePage />
  </StrictMode>
);
