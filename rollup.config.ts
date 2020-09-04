import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
// import babel from "@rollup/plugin-babel";

export default {
  input: "src/illuminated.ts",
  output: {
    dir: "dist",
    format: "umd",
    name: "Illuminated",
    sourcemap: true
  },
  plugins: [
    typescript(),
    terser({
      format: {
        comments: false
      }
    })
    // , babel({
    //   babelHelpers: "runtime",
    //   presets: ["@babel/preset-env"],
    //   plugins: [["@babel/plugin-transform-runtime", { useESModules: true }]],
    //   extensions: [".ts"]
    // })
  ]
};
