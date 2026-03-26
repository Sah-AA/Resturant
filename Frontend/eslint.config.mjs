import { defineConfig } from "eslint/config";

const eslintConfig = defineConfig([
  {
    ignores: ["dist/**", "build/**", "node_modules/**"],
  },
]);

export default eslintConfig;
