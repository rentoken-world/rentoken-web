import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// 简化的ESLint配置，移除可能导致问题的复杂规则
const eslintConfig = [
  ...compat.extends("next"),
  {
    rules: {
      // 基础规则 - 保持代码质量但不过于严格
      "react/no-unescaped-entities": "off",
      "no-console": "off",
      "@next/next/no-img-element": "off",
      "no-unused-vars": "off",
      "prefer-const": "off",
    },
  },
];

export default eslintConfig;
