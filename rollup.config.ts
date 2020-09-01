import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";

export default {
  input: "./src/illuminated.ts",
  output: [
    {
      file: "dist/illuminated.js",
      format: "umd",
      name: "Illuminated",
      sourcemap: true
    },
    {
      file: "dist/illuminated.esm.js",
      format: "es",
      sourcemap: true
    }
  ],
  plugins: [
    typescript(),
    terser({
      format: {
        comments: false
      }
    })
  ]
};
