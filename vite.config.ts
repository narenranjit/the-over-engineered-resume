import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
// https://vite.dev/config/
export default defineConfig({
  preview: {
    port: 3001,
  },
  assetsInclude: ["**/*.md"],
  plugins: [react()],
});
