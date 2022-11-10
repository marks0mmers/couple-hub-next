module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "next/core-web-vitals",
    "prettier"
  ],
  parser: "@typescript-eslint/parser",
  rules: {
    quotes: ["warn", "double"]
  }
}
