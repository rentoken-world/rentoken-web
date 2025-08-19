import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      // 禁用 TypeScript 相关规则
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      
      // 禁用 React 相关严格规则
      "react/no-unescaped-entities": "off",
      "react-hooks/exhaustive-deps": "off",
      
      // 禁用 Next.js 图片优化警告
      "@next/next/no-img-element": "off",
      
      // 禁用其他常见警告
      "prefer-const": "off",
      "no-unused-vars": "off",
      "no-console": "off",
    }
  }
];

export default eslintConfig;
