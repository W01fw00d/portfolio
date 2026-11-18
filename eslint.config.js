import globals from "globals";

export default [
  {
    ignores: ["node_modules/**", "static-app/_site/**", "static-app/node_modules/**"],
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "no-unused-vars": "warn",
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
  },
];
