import esbuild from "rollup-plugin-esbuild";
import { terser } from "rollup-plugin-terser";
import { getBabelOutputPlugin } from "@rollup/plugin-babel";

import dts from "rollup-plugin-dts";

import { main, module, browser, types } from "./package.json";
import { compilerOptions } from "./tsconfig.json";

const input = "src/illuminated.ts";
const sourcemap = true;
const { target } = compilerOptions;

export default [
  {
    input,
    output: [
      {
        file: main,
        format: "cjs",
        sourcemap
      },
      {
        file: module,
        format: "esm",
        sourcemap
      },
      {
        file: browser,
        format: "umd",
        name: "illuminated",
        sourcemap
      }
    ],
    plugins: [
      getBabelOutputPlugin({
        allowAllFormats: true,
        plugins: ["@babel/plugin-transform-block-scoping"]
      }),
      terser(),
      esbuild({
        target,
        minify: true,
        sourceMap: sourcemap
      })
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
