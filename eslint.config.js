import globals from "globals";
import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  eslintConfigPrettier,
  {
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      "no-var": "warn",
      "quotes": ["warn", "double"],
      "semi": ["warn", "always"],
      "quote-props": "off",
    },
  },
];
