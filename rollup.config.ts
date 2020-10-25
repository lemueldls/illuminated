import esbuild from "rollup-plugin-esbuild";
import { terser } from "rollup-plugin-terser";
import dts from "rollup-plugin-dts";

import { main, module, browser, types } from "./package.json";
import { compilerOptions } from "./tsconfig.json";

const input = "src/illuminated.ts";
const { target } = compilerOptions;

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
        target,
        minify: true,
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
        sourcemap: false
      }
    ],
    plugins: [dts()]
  }
];
