import { plugin as mdPlugin} from "vite-plugin-markdown";

/** @type {import('vite').UserConfig} */
export default {
  plugins: [mdPlugin({
    mode: "html",
  })]
  // ...
}