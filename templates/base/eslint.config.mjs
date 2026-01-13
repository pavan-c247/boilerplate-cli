import { FlatCompat } from "@eslint/eslintrc";
import storybook from "eslint-plugin-storybook";
import unusedImports from "eslint-plugin-unused-imports";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import react from "eslint-plugin-react";
import sonarjs from "eslint-plugin-sonarjs";

const compat = new FlatCompat();

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),

  {
    files: [
      "next.config.ts",
      "**/*.js",
      "**/*.jsx",
      "**/*.ts",
      "**/*.tsx",
    ],

    plugins: {
      react,
      sonarjs,
      "unused-imports": unusedImports,
      "simple-import-sort": simpleImportSort,
    },

    rules: {
      "unused-imports/no-unused-imports": "error",
      "simple-import-sort/imports": "error",

      "no-console": ["error", { allow: ["warn", "error"] }],
      "eqeqeq": "error",
      "prefer-const": "error",
      "no-var": "error",

      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "react/prop-types": "off",

      "sonarjs/no-duplicate-string": ["warn", { threshold: 4 }],
      "sonarjs/cognitive-complexity": ["error", 50],
    },
  },

  ...storybook.configs["flat/recommended"],
];

export default eslintConfig;
