import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import { main, module } from "./package.json";

export default {
  input: "src/illuminated.ts",
  output: [
    {
      file: main,
      format: "umd",
      name: "Illuminated",
      sourcemap: true
    },
    {
      file: module,
      format: "es",
      sourcemap: true
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript({ useTsconfigDeclarationDir: true }),
    terser({
      format: {
        comments: false
      }
    })
  ]
};
