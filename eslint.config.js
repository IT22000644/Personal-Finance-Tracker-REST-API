import globals from "globals";

import path from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import pluginJs from "@eslint/js";
import js from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import pluginJest from 'eslint-plugin-jest'

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({baseDirectory: __dirname, recommendedConfig: pluginJs.configs.recommended});

export default [
  {languageOptions: { globals: globals.browser }},
  ...compat.extends("airbnb-base"),
  js.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: pluginJest.environments.globals.globals,
    },
    rules: {
      'no-unused-vars': 'off',
      'import/no-dynamic-require': 'warn',
      'import/no-nodejs-modules': 'off',
      'import/extensions': ['error', 'always', { js: 'always', json: 'never' }],
      'no-underscore-dangle': ["error", { "allow": ["__filename", "__dirname", "_id", "_doc"] }],
      'consistent-return': ["off", { "treatUndefinedAsUnspecified": true }],
      "prettier/prettier": ["error", {
            "endOfLine": "auto"
        }]
    },
  },
  eslintPluginPrettierRecommended,
  {
    ignores: ["*.config.js"],
  },
];