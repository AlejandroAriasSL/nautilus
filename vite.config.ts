import { defineConfig } from 'vite';
import path from 'path';
import dtsPlugin from 'vite-plugin-dts';
import ts from "@rollup/plugin-typescript";


export default defineConfig({
  plugins: [
    dtsPlugin({
      insertTypesEntry: true,
    }),
    ts({
      tsconfig: "./tsconfig.json"
    })
  ],
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, './src'),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'Nautilus',
      fileName: (format) => `nautilus.${format}.js`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['reflect-metadata'],
      output: {
        globals: {
          'reflect-metadata' : "Reflect"
        },
      },
    },
    sourcemap: true,
  },
});