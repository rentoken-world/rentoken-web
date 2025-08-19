/** @type {import('next').NextConfig} */
const nextConfig = {
  // 禁用 TypeScript 错误检查
  typescript: {
    ignoreBuildErrors: true,
  },
  // 禁用 ESLint 检查
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
