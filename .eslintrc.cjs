module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  ignorePatterns: ["dist/", "node_modules/", "src/ignored-folder/"],
  plugins: ["react", "@typescript-eslint", "jsx-a11y", "import"],
  rules: {
    "@typescript-eslint/no-unused-vars": "error",
    "react/jsx-key": "error",
    "react/jsx-no-duplicate-props": "error",
    "no-console": "error",
    "no-debugger": "error",
    "react/self-closing-comp": [
      "error",
      {
        component: true,
        html: false,
      },
    ],
    "jsx-a11y/alt-text": "error",
    "prefer-const": "error",
    "no-var": "error",
    "max-len": ["error", { code: 150 }],
    "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 0 }],
    "react/jsx-no-useless-fragment": "error",
    "react/react-in-jsx-scope": "off",
    eqeqeq: "error",
    "ckeditor5-rules/ckeditor-imports": "error",
    "ckeditor5-rules/license-header": [
      "error",
      {
        headerLines: [
          "/**",
          " * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.",
          " * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license",
          " */",
        ],
      },
    ],
    "ckeditor5-rules/require-file-extensions-in-imports": [
      "error",
      {
        extensions: [".ts", ".js", ".json"],
      },
    ],
  },
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      typescript: {},
    },
  },
  overrides: [
    {
      files: ["**/tests/**/*.@(js|ts)"],
      rules: {
        "no-unused-expressions": "off",
        "ckeditor5-rules/ckeditor-imports": "off",
        "ckeditor5-rules/no-cross-package-imports": "off",
      },
    },
    {
      files: ["**/docs/**/*.js"],
      rules: {
        "ckeditor5-rules/ckeditor-imports": "off",
      },
    },
  ],
};
