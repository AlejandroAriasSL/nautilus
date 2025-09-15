import { defineConfig } from 'vite';
import path from 'path';
import dtsPlugin from 'vite-plugin-dts';
import ts from "@rollup/plugin-typescript";


export default defineConfig({
  plugins: [
    dtsPlugin({
      insertTypesEntry: true,
    }),
  ],
  esbuild:{
    target: "ES2022"
  },
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, './src'),
      '@lib': path.resolve(__dirname, './lib'),
      '@decorators': path.resolve(__dirname, './src/decorators'),
      '@registries': path.resolve(__dirname, './src/registries'),
      '@generated' : path.resolve(__dirname, './build/generated')
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