/*
 * @Author: dreamworks.cnn@gmail.com
 * @Date: 2025-08-21 17:12:38
 * @LastEditors: dreamworks.cnn@gmail.com
 * @LastEditTime: 2025-08-21 20:38:47
 * @FilePath: /rentoken-web/src/config/contracts.ts
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
// 合约配置
export interface ContractAddresses {
  renToken: string;
  propertyManager: string;
}

const LOCAL_KYC_ORACLE_ADDR = '0xd35c0F669e40cbE2646D5ACeB713FC70F9F95317'
const LOCAL_PROPERTY_ORACLE_ADDR = '0x05325EF4e7d91153f0Dd0A774D09189b646B9365'
const LOCAL_RENT_TOKEN_IMPL_ADDR = '0x6E0D1a311Db4525e0953A751EA32E810c6E464C8'
const LOCAL_SERIES_FACTORY_ADDR = '0x8DEEA1fa66479bc345C24e0157727d9F12287b80'
const LOCAL_USDC_ADDR = '0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
const LOCAL_SANCTION_ORACLE_ADDR = '0x40C57923924B5c5c5455c48D93317139ADDaC8fb'
const LOCAL_USDC_WHALE = '0x55fe002aeff02f77364de339a1292923a15844b8'

// 不同环境的合约地址配置
export const CONTRACTS: Record<string, ContractAddresses> = {
  // 本地开发环境 (Hardhat/Anvil)
  local: {
    KYC_ORACLE_ADDR: LOCAL_KYC_ORACLE_ADDR,
    PROPERTY_ORACLE_ADDR: LOCAL_PROPERTY_ORACLE_ADDR,
    RENT_TOKEN_IMPL_ADDR: LOCAL_RENT_TOKEN_IMPL_ADDR,
    SERIES_FACTORY_ADDR: LOCAL_SERIES_FACTORY_ADDR,
    USDC_ADDR: LOCAL_USDC_ADDR,
    SANCTION_ORACLE_ADDR: LOCAL_SANCTION_ORACLE_ADDR,
    USDC_WHALE: LOCAL_USDC_WHALE,        
  },
  
  // 测试网环境 (Sepolia)
  testnet: {
    renToken: process.env.NEXT_PUBLIC_CONTRACT_TESTNET_RENTOKEN || '0x0000000000000000000000000000000000000000',
    propertyManager: process.env.NEXT_PUBLIC_CONTRACT_TESTNET_PROPERTY_MANAGER || '0x0000000000000000000000000000000000000000',
  },
  
  // 生产环境 (Mainnet)
  mainnet: {
    renToken: process.env.NEXT_PUBLIC_CONTRACT_MAINNET_RENTOKEN || '0x0000000000000000000000000000000000000000',
    propertyManager: process.env.NEXT_PUBLIC_CONTRACT_MAINNET_PROPERTY_MANAGER || '0x0000000000000000000000000000000000000000',
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
