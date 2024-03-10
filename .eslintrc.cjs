module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    sourceType: "module"
  },
  rules: {
    quotes: ["warn", "double"],
    semi: ["warn", "always"]
  }
};
