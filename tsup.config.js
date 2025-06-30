'use strict';
import { defineConfig } from 'tsup';
export default defineConfig({
  entry: ['./src/index.js'],
  format: ['esm'],
  platform: 'node',
  dts: false,
  bundle: true,
  splitting: false,
  outDir: 'dist',
  clean: true,
  shims: true,
  treeshake: false,
  minify: true,
  target: 'es2022',
  define: {},
});
