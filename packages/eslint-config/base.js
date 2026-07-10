import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

/**
 * Shared flat config for framework-agnostic TypeScript packages.
 */
export default tseslint.config(
  {
    ignores: ["dist/**", "coverage/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  eslintConfigPrettier,
);
