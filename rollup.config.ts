import typescript from "rollup-plugin-typescript2";

export default {
  input: "./src/index.ts",
  output: [
    {
      file: "dist/illuminated.js",
      format: "umd",
      name: "Illuminated",
      sourcemap: true,
    },
    {
      file: "dist/illuminated.esm.js",
      format: "es",
      sourcemap: true,
    },
  ],
  plugins: [typescript()],
};
