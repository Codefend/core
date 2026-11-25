import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  target: "node18.0.0",
  platform: "node",
  fixedExtension: false,
  outDir: "dist",
  dts: true,
  sourcemap: true,
  clean: true,
  exports: false,
});
