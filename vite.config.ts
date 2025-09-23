import path from "path";
import { defineConfig } from "vite";
import nautilus from "vite-plugin-nautilus";

export default defineConfig({
  plugins: [nautilus()],
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
  build: {
    lib: {
      entry: path.resolve(__dirname, "main.ts"),
      formats: ["es"],
      fileName: (format) => `nautilus.${format}.js`,
    },
    rollupOptions: {
      external: ["fs", "path", "url", "ts-morph"],
      input: {
        "main": path.resolve(__dirname, "main.ts"),
        "src/index": path.resolve(__dirname, "./src/index.ts"),
        "src/decorators/index": path.resolve(
          __dirname,
          "./src/decorators/index.ts",
        ),
        "tools/generate-autowired": path.resolve(__dirname, "scripts/generate-autowired.ts"),
        "tools/inject-static-files" : path.resolve(__dirname, "scripts/inject-static-files.ts"),
        "tools/get-autowired-metadata" : path.resolve(__dirname, "scripts/get-autowired-metadata.ts"),
        ".nautilus/generated/autowired-metadata": path.resolve(__dirname, "./.nautilus/generated/autowired-metadata.ts")
      },
      output: {
        entryFileNames: (chunkInfo) => {
        if (chunkInfo.name === "main") return "nautilus.es.js";
        return "[name].es.js";
      },
        dir: "dist",
      },
      
    },
    sourcemap: true,
  },
   test: {
      globals: true,
      environment: "happy-dom",
      setupFiles: ["./vitest.setup.js"],
      alias: {
        "@src": path.resolve(__dirname, "./src"),
        "@lib": path.resolve(__dirname, "./lib"),
        "@decorators": path.resolve(__dirname, "./src/decorators"),
        "@registries": path.resolve(__dirname, "./src/registries"),
        '@generated' : path.resolve(__dirname, './build/generated'),
      },
      coverage: {
        provider: "v8",
        enabled: true,
      },
    },
});
