import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ResumePage from "./new/ResumeApp.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ResumePage />
  </StrictMode>,
);
