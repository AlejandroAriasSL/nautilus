import { defineConfig } from "vite";
import path from "path";
import nautilus from "vite-plugin-nautilus";

export default defineConfig({
  plugins: [nautilus()],
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "./src"),
      "@lib": path.resolve(__dirname, "./lib"),
      "@decorators": path.resolve(__dirname, "./src/decorators"),
      "@registries": path.resolve(__dirname, "./src/registries"),
      "@generated": path.resolve(__dirname, "./build/generated"),
      "@plugins": path.resolve(__dirname, "./plugins"),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "Nautilus",
      fileName: (format) => `nautilus.${format}.js`,
      formats: ["es", "cjs"],
    },
    sourcemap: true,
  },
});
