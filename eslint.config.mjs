import globals from 'globals';
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import stylisticJs from '@stylistic/eslint-plugin-js';

export default defineConfig([
  js.configs.recommended,
  { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
  { files: ['**/*.{js,mjs,cjs}'], languageOptions: { globals: globals.node } },
  {
    plugins: {
      '@stylistic/js': stylisticJs,
    },
  },
  {
    rules: {
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/linebreak-style': ['error', 'unix'],
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/no-unused-vars': 'off',
    },
  },
  { ignores: ['dist/**'] },
]);
