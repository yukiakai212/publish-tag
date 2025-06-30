import { defineConfig } from 'eslint/config';
import pluginN from 'eslint-plugin-n';

export default defineConfig([
  {
    files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
    rules: {
      'prefer-const': 'warn',
      'no-constant-binary-expression': 'error',
      'n/no-missing-import': 'error',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
    ignores: ['dist/**', 'node_modules/**'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      n: pluginN,
    },
  },
]);
