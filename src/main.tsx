import { StrictMode } from "react";
import ResumePage from "./ResumeApp.tsx";
import { ViteReactSSG } from "vite-react-ssg/single-page";

export const createRoot = ViteReactSSG(
  <StrictMode>
    <ResumePage />
  </StrictMode>
);
