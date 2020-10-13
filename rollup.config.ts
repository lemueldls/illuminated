import esbuild from "rollup-plugin-esbuild";
import dts from "rollup-plugin-dts";
import { main, module, browser, types } from "./package.json";

const input = "src/illuminated.ts";

export default [
  {
    input,
    output: [
      {
        file: main,
        format: "cjs",
        sourcemap: true
      },
      {
        file: module,
        format: "es",
        sourcemap: true
      },
      {
        file: browser,
        format: "umd",
        name: "illuminated",
        sourcemap: true
      }
    ],
    plugins: [esbuild({ sourceMap: true, minify: true })]
  },
  { input, output: [{ file: types, format: "es" }], plugins: [dts()] }
];
