/*
 * @Author: dreamworks.cnn@gmail.com
 * @Date: 2025-08-23 19:50:00
 * @LastEditors: dreamworks.cnn@gmail.com
 * @LastEditTime: 2025-08-23 19:50:00
 * @FilePath: /rentoken-web/src/hooks/useRentTokenPhase.ts
 * @Description: 获取RentToken合约的当前阶段状态
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */

import { useMemo } from 'react';
import { type Address } from 'viem';
import { useReadContract } from 'wagmi';
import RentTokenABI from '_commons_/ABI/RentToken.json';

// 定义Phase枚举，对应Solidity合约中的enum RentToken.Phase
export enum RentTokenPhase {
  FUNDRAISING = 0,    // 募资阶段
  OPERATING = 1,      // 运营阶段
  MATURED = 2,        // 成熟阶段
  REFUNDING = 3,      // 退款阶段
}

// Phase的中文描述
export const PHASE_DESCRIPTIONS: Record<RentTokenPhase, string> = {
  [RentTokenPhase.FUNDRAISING]: '募资阶段',
  [RentTokenPhase.OPERATING]: '运营阶段',
  [RentTokenPhase.MATURED]: '成熟阶段',
  [RentTokenPhase.REFUNDING]: '退款阶段',
};

/**
 * 获取RentToken合约的当前阶段状态
 * @param rentTokenAddress RentToken合约地址
 * @param enabled 是否启用查询，默认为true
 */
export function useRentTokenPhase(rentTokenAddress: Address | undefined, enabled: boolean = true) {
  // 读取合约当前阶段
  const { data: phase, isError, isLoading, refetch } = useReadContract({
    address: rentTokenAddress,
    abi: RentTokenABI as any,
    functionName: 'getPhase',
    query: {
      enabled: enabled && !!rentTokenAddress,
      // 每60秒自动刷新一次，因为phase变化不会太频繁
      refetchInterval: 60000,
    },
  });

  // 解析阶段信息
  const phaseInfo = useMemo(() => {
    if (phase === undefined) {
      return null;
    }
    
    const phaseValue = Number(phase) as RentTokenPhase;
    
    return {
      value: phaseValue,
      name: RentTokenPhase[phaseValue],
      description: PHASE_DESCRIPTIONS[phaseValue],
      // 阶段状态判断
      isFundraising: phaseValue === RentTokenPhase.FUNDRAISING,
      isOperating: phaseValue === RentTokenPhase.OPERATING,
      isMatured: phaseValue === RentTokenPhase.MATURED,
      isRefunding: phaseValue === RentTokenPhase.REFUNDING,
    };
  }, [phase]);

  return {
    // 原始阶段值
    phase: phase as number | undefined,
    // 解析后的阶段信息
    phaseInfo,
    // 状态
    isLoading,
    isError,
    // 手动刷新函数
    refetch,
    // 是否有有效的合约地址
    hasValidAddress: !!rentTokenAddress,
    // 便捷的阶段判断方法
    isFundraising: phaseInfo?.isFundraising ?? false,
    isOperating: phaseInfo?.isOperating ?? false,
    isMatured: phaseInfo?.isMatured ?? false,
    isRefunding: phaseInfo?.isRefunding ?? false,
  };
}
