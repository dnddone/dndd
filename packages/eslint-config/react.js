import globals from "globals";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";
import baseConfig from "./base.js";

/**
 * Shared flat config for React libraries. Extends the base config with the
 * React and React Hooks rule sets. `eslint-config-prettier` (last in the base
 * config) still wins, so no formatting rules leak in.
 */
export default tseslint.config(
  ...baseConfig,
  {
    files: ["**/*.{ts,tsx}"],
    ...reactPlugin.configs.flat.recommended,
    settings: {
      react: {
        version: "detect",
      },
    },
    languageOptions: {
      ...reactPlugin.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      /**
       * The new JSX transform makes React-in-scope unnecessary, and TypeScript
       * already covers prop typing.
       */
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
  },
);
