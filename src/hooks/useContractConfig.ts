/*
 * @Author: dreamworks.cnn@gmail.com
 * @Date: 2025-08-21 17:26:04
 * @LastEditors: dreamworks.cnn@gmail.com
 * @LastEditTime: 2025-08-21 20:29:06
 * @FilePath: /rentoken-web/src/hooks/useContractConfig.ts
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
import { useMemo } from 'react';
import { useChainId } from 'wagmi';
import { 
  getContractAddresses, 
  getContractAddress, 
  getCurrentEnvironment, 
  getEnvironmentInfo,
  type ContractAddresses 
} from '@/config/contracts';
import { getEnvironmentByChainId } from '@/config/chains';

/**
 * 获取合约配置的自定义 Hook
 */
export function useContractConfig() {
  const chainId = useChainId();
  
  const contractConfig = useMemo(() => {
    // 根据当前连接的链获取环境
    console.log('chainId', chainId);
    const chainEnvironment = getEnvironmentByChainId(chainId);
    const configEnvironment = getCurrentEnvironment();
    
    // 如果链环境与配置环境不匹配，优先使用链环境
    const actualEnvironment = chainEnvironment !== 'unknown' ? chainEnvironment : configEnvironment;
    
    const addresses = getContractAddresses();
    const envInfo = getEnvironmentInfo();
    
    return {
      environment: actualEnvironment,
      chainId,
      addresses,
      ...envInfo,
      // 环境匹配状态
      isEnvironmentMatched: chainEnvironment === configEnvironment || chainEnvironment === 'unknown',
    };
  }, [chainId]);
  
  return contractConfig;
}

/**
 * 获取特定合约地址的 Hook
 */
export function useContractAddress(contractName: keyof ContractAddresses) {
  const address = useMemo(() => {
    return getContractAddress(contractName);
  }, [contractName]);
  
  return address;
}

/**
 * 检查合约配置是否有效的 Hook
 */
export function useContractValidation() {
  const config = useContractConfig();
  
  const validation = useMemo(() => {
    const { addresses, hasValidContracts, isEnvironmentMatched } = config;
    
    return {
      isValid: hasValidContracts && isEnvironmentMatched,
      hasValidContracts,
      isEnvironmentMatched,
      issues: [
        ...(!hasValidContracts ? ['合约地址无效或未设置'] : []),
        ...(!isEnvironmentMatched ? ['当前连接的链与配置环境不匹配'] : []),
      ],
      addresses,
    };
  }, [config]);
  
  return validation;
}
