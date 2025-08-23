import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'viem';
import { getSupportedChains, getDefaultChain } from './chains';

export const config = getDefaultConfig({
  appName: 'RenToken',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID', // 从 https://cloud.walletconnect.com 获取
  chains: getSupportedChains() as any,
  transports: {
    // 为每个支持的链配置自定义传输
    [31337]: http('http://127.0.0.1:8545'), // 本地 Hardhat/Anvil (标准配置)
    [1]: http('http://127.0.0.1:8545'), // 本地 Anvil fork 主网时使用
    [11155111]: http(), // Sepolia 使用默认 RPC
    [137]: http(), // Polygon 使用默认 RPC
    [10]: http(), // Optimism 使用默认 RPC
    [42161]: http(), // Arbitrum 使用默认 RPC
    [8453]: http(), // Base 使用默认 RPC
  },
  ssr: true, // 如果您的 dApp 使用服务器端渲染 (SSR)
});

// 导出默认链，供其他组件使用
export const defaultChain = getDefaultChain();
