import { plugin as mdPlugin} from "vite-plugin-markdown";
import markdownIt from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';

const md = markdownIt();
md.use(markdownItAttrs);

/** @type {import('vite').UserConfig} */
export default {
  plugins: [mdPlugin({
    mode: "html",
    markdownIt: md
  })]
  // ...
}