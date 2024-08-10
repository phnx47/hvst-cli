import globals from "globals";
import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: globals.node
    },
    rules: {
      "no-var": "warn",
      quotes: ["warn", "double"],
      semi: ["warn", "always"]
    }
  }
];
