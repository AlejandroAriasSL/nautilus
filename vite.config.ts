import path from "path";
import { defineConfig } from "vite";
import dtsPlugin from "vite-plugin-dts";
import runCommand from "./scripts/run-command";

const virtualModuleId = "virtual:nautilus";
const resolvedVirtualModuleId = "\0" + virtualModuleId;

export default defineConfig({
  plugins: [
    dtsPlugin({
      outDir: "./dist",
      insertTypesEntry: true,
      copyDtsFiles: true,
      include: ["src", "main.ts"],
      tsconfigPath: "./tsconfig.json",
      afterBuild: async (emittedFiles) => {
        const { mergeFiles } = await import("./scripts/merge-files.js");
        mergeFiles(emittedFiles);
      },
    }),
    {
      name: "nautilus-lib",
      resolveId(id) {
        if (id === virtualModuleId) {
          return resolvedVirtualModuleId;
        }
      },

      async load(id) {
        if (id === resolvedVirtualModuleId) {
          const config = await runCommand(
            path.resolve(__dirname, "scripts", "load-config.ts")
          );
          return `export default ${JSON.stringify(config, null, 2)}`;
        }
      },
    },
  ],
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "./src"),
      "@lib": path.resolve(__dirname, "./src/lib"),
      "@decorators": path.resolve(__dirname, "./src/decorators"),
      "@registries": path.resolve(__dirname, "./src/registries"),
      "@generated": path.resolve(process.cwd(), "./.nautilus/generated"),
      "@plugins": path.resolve(__dirname, "./plugins"),
    },
  },
  esbuild: {
    target: "es2022",
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "main.ts"),
      name: "nautilus",
      fileName: (format) => `nautilus.${format}.js`,
      formats: ["es"],
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
      "@generated": path.resolve(__dirname, "./build/generated"),
    },
    coverage: {
      provider: "v8",
      enabled: true,
    },
  },
});
