import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { plugin as mdPlugin, Mode } from "vite-plugin-markdown";
import markdownIt from "markdown-it";
import markdownItAttrs from "markdown-it-attrs";

const md = markdownIt({
  html: true,
  typographer: true,
});
md.use(markdownItAttrs);
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    mdPlugin({
      mode: [Mode.HTML],
      markdownIt: md,
    }),
  ],
});
