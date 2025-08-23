/*
 * @Author: dreamworks.cnn@gmail.com
 * @Date: 2025-08-21 17:12:38
 * @LastEditors: dreamworks.cnn@gmail.com
 * @LastEditTime: 2025-08-23 16:46:22
 * @FilePath: /rentoken-web/src/config/contracts.ts
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
// 合约配置
import DEV_CONTRACTS_ADDRESS from './address/dev.json'
import SEPOLIA_CONTRACTS_ADDRESS from './address/sepolia.json'

export interface ContractAddresses {
  KYC_ORACLE_ADDR: string;
  PROPERTY_ORACLE_ADDR: string;
  RENT_TOKEN_IMPL_ADDR: string;
  SERIES_FACTORY_ADDR: string;
  USDC_ADDR: string;
  SANCTION_ORACLE_ADDR: string;
}

// 不同环境的合约地址配置
export const CONTRACTS: Record<string, ContractAddresses> = {
  // 本地开发环境 (Hardhat/Anvil)
  local: DEV_CONTRACTS_ADDRESS,
  
  // 测试网环境 (Sepolia)
  testnet: SEPOLIA_CONTRACTS_ADDRESS,
  
  // 生产环境 (Mainnet)
  mainnet: {
    KYC_ORACLE_ADDR: process.env.NEXT_PUBLIC_CONTRACT_MAINNET_KYC_ORACLE || '0x0000000000000000000000000000000000000000',
    PROPERTY_ORACLE_ADDR: process.env.NEXT_PUBLIC_CONTRACT_MAINNET_PROPERTY_ORACLE || '0x0000000000000000000000000000000000000000',
    RENT_TOKEN_IMPL_ADDR: process.env.NEXT_PUBLIC_CONTRACT_MAINNET_RENT_TOKEN_IMPL || '0x0000000000000000000000000000000000000000',
    SERIES_FACTORY_ADDR: process.env.NEXT_PUBLIC_CONTRACT_MAINNET_SERIES_FACTORY || '0x0000000000000000000000000000000000000000',
    USDC_ADDR: process.env.NEXT_PUBLIC_CONTRACT_MAINNET_USDC || '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // 主网USDC
    SANCTION_ORACLE_ADDR: process.env.NEXT_PUBLIC_CONTRACT_MAINNET_SANCTION_ORACLE || '0x0000000000000000000000000000000000000000',
  },
};

// 获取当前环境
export const getCurrentEnvironment = (): string => {
  return process.env.NEXT_PUBLIC_DEPLOYMENT_ENV || 'local';
};

// 获取当前环境的合约地址
export const getContractAddresses = (): ContractAddresses => {
  const env = getCurrentEnvironment();
  return CONTRACTS[env] || CONTRACTS.local;
};

// 获取特定合约地址
export const getContractAddress = (contractName: keyof ContractAddresses): string => {
  const addresses = getContractAddresses();
  return addresses[contractName];
};

// 验证合约地址是否有效
export const isValidContractAddress = (address: string): boolean => {
  return address !== '0x0000000000000000000000000000000000000000' && address.length === 42;
};

// 获取当前环境信息
export const getEnvironmentInfo = () => {
  const env = getCurrentEnvironment();
  const addresses = getContractAddresses();
  
  return {
    environment: env,
    isProduction: env === 'mainnet',
    isTestnet: env === 'testnet', 
    isLocal: env === 'local',
    contracts: addresses,
    hasValidContracts: Object.values(addresses).every(isValidContractAddress),
  };
};
