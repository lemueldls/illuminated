import esbuild from "rollup-plugin-esbuild";
import { terser } from "rollup-plugin-terser";
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
        format: "esm",
        sourcemap: true
      },
      {
        file: browser,
        format: "umd",
        name: "illuminated",
        sourcemap: true
      }
    ],
    plugins: [
      esbuild({
        minify: true,
        target: "es2016",
        sourceMap: true
      }),
      terser()
    ]
  },
  {
    input,
    output: [
      {
        file: types,
        format: "es",
        sourcemap: true
      }
    ],
    plugins: [dts()]
  }
];
