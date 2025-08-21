import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { getSupportedChains, getDefaultChain } from './chains';

export const config = getDefaultConfig({
  appName: 'RenToken',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID', // 从 https://cloud.walletconnect.com 获取
  chains: getSupportedChains() as any,
  ssr: true, // 如果您的 dApp 使用服务器端渲染 (SSR)
});

// 导出默认链，供其他组件使用
export const defaultChain = getDefaultChain();
