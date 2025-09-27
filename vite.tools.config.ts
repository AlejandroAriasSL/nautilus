import { defineConfig } from "vite";
import path, { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "./src"),
      "@lib": path.resolve(__dirname, "./src/lib"),
      "@decorators": path.resolve(__dirname, "./src/decorators"),
      "@registries": path.resolve(__dirname, "./src/registries"),
      "@generated": path.resolve(__dirname, "./.nautilus/generated"),
      "@plugins": path.resolve(__dirname, "./plugins"),
    },
  },
  esbuild: {
    target: "es2022",
  },
  build: {
    target: "es2022",
    rollupOptions: {
      external: ["fs", "path", "url", "ts-morph"],
      input: {
        "generate-autowired": resolve(
          __dirname,
          "scripts/generate-autowired.ts"
        ),
        "inject-static-files": resolve(
          __dirname,
          "scripts/inject-static-files.ts"
        ),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === "main") return "nautilus.es.js";
          return "[name].es.js";
        },
        dir: "dist/tools",
      },
    },
    sourcemap: true,
  },
});
