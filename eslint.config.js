import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";
import prettierPlugin from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import reactRefresh from "eslint-plugin-react-refresh";

export default defineConfig([
  {
    ignores: ["node_modules/", "dist/", "build/"],
    languageOptions: {
      globals: globals.browser,
    },
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ["**/*.jsx", "**/*.tsx"],
    plugins: {
      react: pluginReact,
      "react-hooks": reactHooksPlugin,
      "react-refresh": reactRefresh,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  {
    plugins: { prettier: prettierPlugin },
    rules: {
      "prettier/prettier": "error",
    },
  },
  eslintConfigPrettier,
]);
