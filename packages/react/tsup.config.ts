import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/styles/button.css"],
  format: ["esm", "cjs"],
  dts: { entry: ["src/index.ts"] },
  clean: true,
  sourcemap: true,
  treeshake: true,
  external: ["react", "react-dom"],
});
