'use strict';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['__tests__/*.test.js'],
    coverage: {
      provider: 'v8',
      exclude: ['build.js', '**/dist/**', '*.config.js'],
    },
  },
});
