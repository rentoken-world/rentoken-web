// 链配置
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
  localhost,
} from 'wagmi/chains';
import { Chain } from 'wagmi/chains';

// 本地开发链配置
export const hardhatChain: Chain = {
  ...localhost,
  id: 31337,
  name: 'Hardhat',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:8545'],
    },
  },
};

// 根据环境获取支持的链
export const getSupportedChains = (): Chain[] => {
  const environment = process.env.NEXT_PUBLIC_DEPLOYMENT_ENV || 'local';
  
  switch (environment) {
    case 'local':
      // 本地环境：支持本地链和测试链
      return [
        hardhatChain,
        sepolia,
        // 可以添加其他测试链
      ];
      
    case 'testnet':
      // 测试网环境：支持各种测试网
      return [
        sepolia,
        // 可以添加其他测试网如 arbitrum goerli, polygon mumbai 等
      ];
      
    case 'mainnet':
      // 生产环境：支持主网
      return [
        mainnet,
        polygon,
        optimism,
        arbitrum,
        base,
      ];
      
    default:
      // 默认返回测试网配置
      return [sepolia];
  }
};

// 获取默认链
export const getDefaultChain = (): Chain => {
  const environment = process.env.NEXT_PUBLIC_DEPLOYMENT_ENV || 'local';
  
  switch (environment) {
    case 'local':
      return hardhatChain;
    case 'testnet':
      return sepolia;
    case 'mainnet':
      return mainnet;
    default:
      return sepolia;
  }
};

// 根据链ID获取环境类型
export const getEnvironmentByChainId = (chainId: number): string => {
  if (chainId === 31337) return 'local';
  if (chainId === 11155111) return 'testnet'; // Sepolia
  if ([1, 137, 10, 42161, 8453].includes(chainId)) return 'mainnet';
  return 'unknown';
};
