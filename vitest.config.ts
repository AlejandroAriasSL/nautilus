import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./vitest.setup.js"],
    alias: {
      "@src": path.resolve(__dirname, "./src"),
      "@lib": path.resolve(__dirname, "./lib"),
      "@decorators": path.resolve(__dirname, "./src/decorators"),
      "@registries": path.resolve(__dirname, "./src/registries"),
    },
    coverage: {
      provider: "v8",
      enabled: true,
    },
  },
});
