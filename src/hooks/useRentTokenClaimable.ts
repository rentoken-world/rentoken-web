/*
 * @Author: dreamworks.cnn@gmail.com
 * @Date: 2025-08-23 19:55:00
 * @LastEditors: dreamworks.cnn@gmail.com
 * @LastEditTime: 2025-08-23 19:55:00
 * @FilePath: /rentoken-web/src/hooks/useRentTokenClaimable.ts
 * @Description: 获取用户在指定RentToken合约中可领取的收益份额
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */

import { useMemo } from 'react';
import { formatUnits, type Address } from 'viem';
import { useAccount, useReadContract } from 'wagmi';
import RentTokenABI from '_commons_/ABI/RentToken.json';

/**
 * 获取用户在指定RentToken合约中可领取的收益份额
 * @param rentTokenAddress RentToken合约地址
 * @param enabled 是否启用查询，默认为true
 */
export function useRentTokenClaimable(rentTokenAddress: Address | undefined, enabled: boolean = true) {
  const { address } = useAccount();
  
  // 读取用户可领取的收益份额
  const { data: claimableAmount, isError, isLoading, refetch } = useReadContract({
    address: rentTokenAddress,
    abi: RentTokenABI as any,
    functionName: 'claimable',
    args: [address],
    query: {
      enabled: enabled && !!address && !!rentTokenAddress,
      // 每30秒自动刷新一次，收益可能经常变化
      refetchInterval: 30000,
    },
  });

  // 读取支付代币地址
  const { data: payoutTokenAddress } = useReadContract({
    address: rentTokenAddress,
    abi: RentTokenABI as any,
    functionName: 'payoutToken',
    query: {
      enabled: enabled && !!rentTokenAddress,
    },
  });

  // 读取支付代币精度（假设是USDC，通常是6位精度）
  const { data: payoutTokenDecimals } = useReadContract({
    address: payoutTokenAddress as Address,
    abi: [
      {
        type: 'function',
        name: 'decimals',
        inputs: [],
        outputs: [{ name: '', type: 'uint8', internalType: 'uint8' }],
        stateMutability: 'view',
      },
    ],
    functionName: 'decimals',
    query: {
      enabled: enabled && !!payoutTokenAddress,
    },
  });

  // 格式化可领取金额
  const formattedClaimableAmount = useMemo(() => {
    if (!claimableAmount || !payoutTokenDecimals) return '0';
    try {
      return formatUnits(claimableAmount as bigint, Number(payoutTokenDecimals));
    } catch (error) {
      console.error('格式化可领取金额失败:', error);
      return '0';
    }
  }, [claimableAmount, payoutTokenDecimals]);

  // 检查是否有可领取的收益
  const hasClaimableAmount = useMemo(() => {
    if (!claimableAmount) return false;
    return (claimableAmount as bigint) > 0n;
  }, [claimableAmount]);

  return {
    // 原始可领取金额 (bigint)
    claimableAmount: claimableAmount as bigint | undefined,
    // 格式化后的可领取金额字符串
    formattedClaimableAmount,
    // 支付代币地址
    payoutTokenAddress: payoutTokenAddress as Address | undefined,
    // 支付代币精度
    payoutTokenDecimals: payoutTokenDecimals as number | undefined,
    // 是否有可领取的收益
    hasClaimableAmount,
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
