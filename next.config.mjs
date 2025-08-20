/** @type {import('next').NextConfig} */
const nextConfig = {
  // 启用 TypeScript 错误检查以确保代码质量
  typescript: {
    ignoreBuildErrors: false,
  },
  // 启用 ESLint 检查以确保代码质量
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
