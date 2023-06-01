import path from "node:path";

import { defineConfig } from "vitest/config";

import dts from "vite-plugin-dts";

import { main, module, browser } from "./package.json";

import type { LibraryFormats } from "vite";

const formats = { es: module, cjs: main, umd: browser };

export default defineConfig({
  server: {
    open: "demo/index.html"
  },
  build: {
    sourcemap: true,
    lib: {
      entry: "src/illuminated.ts",
      name: "Illuminated",
      fileName: (format) => path.relative("./dist", formats[format as keyof typeof formats]),
      formats: Object.keys(formats) as LibraryFormats[]
    }
  },
  plugins: [dts()],
  test: {
    threads: false,
    environment: "jsdom"
  }
});
