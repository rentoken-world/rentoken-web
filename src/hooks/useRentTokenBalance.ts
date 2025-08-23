/*
 * @Author: dreamworks.cnn@gmail.com
 * @Date: 2025-08-23 19:45:00
 * @LastEditors: dreamworks.cnn@gmail.com
 * @LastEditTime: 2025-08-23 19:45:00
 * @FilePath: /rentoken-web/src/hooks/useRentTokenBalance.ts
 * @Description: 获取用户在指定RentToken合约中的余额
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */

import { useMemo } from 'react';
import { formatUnits, type Address } from 'viem';
import { useAccount, useReadContract } from 'wagmi';
import RentTokenABI from '_commons_/ABI/RentToken.json';

/**
 * 获取用户在指定RentToken合约中的余额
 * @param rentTokenAddress RentToken合约地址
 * @param enabled 是否启用查询，默认为true
 */
export function useRentTokenBalance(rentTokenAddress: Address | undefined, enabled: boolean = true) {
  const { address } = useAccount();
  
  // 读取用户余额
  const { data: balance, isError, isLoading, refetch } = useReadContract({
    address: rentTokenAddress,
    abi: RentTokenABI as any,
    functionName: 'balanceOf',
    args: [address],
    query: {
      enabled: enabled && !!address && !!rentTokenAddress,
      // 每30秒自动刷新一次
      refetchInterval: 30000,
    },
  });

  // 读取代币精度
  const { data: decimals } = useReadContract({
    address: rentTokenAddress,
    abi: RentTokenABI as any,
    functionName: 'decimals',
    query: {
      enabled: enabled && !!rentTokenAddress,
    },
  });

  // 格式化余额显示
  const formattedBalance = useMemo(() => {
    if (!balance || !decimals) return '0';
    try {
      return formatUnits(balance as bigint, Number(decimals));
    } catch (error) {
      console.error('格式化余额失败:', error);
      return '0';
    }
  }, [balance, decimals]);

  return {
    // 原始余额 (bigint)
    balance: balance as bigint | undefined,
    // 格式化后的余额字符串
    formattedBalance,
    // 代币精度
    decimals: decimals as number | undefined,
    // 状态
    isLoading,
    isError,
    // 手动刷新函数
    refetch,
    // 是否已连接钱包
    isConnected: !!address,
    // 是否有有效的合约地址
    hasValidAddress: !!rentTokenAddress,
  };
}
