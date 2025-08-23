/*
 * @Author: dreamworks.cnn@gmail.com
 * @Date: 2025-08-23 20:30:00
 * @LastEditors: dreamworks.cnn@gmail.com
 * @LastEditTime: 2025-08-23 20:30:00
 * @FilePath: /rentoken-web/src/hooks/usePropertiesBlockchainState.ts
 * @Description: 为properties数组添加区块链状态信息
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */

import { useMemo, useEffect, useState } from 'react';
import { type Address } from 'viem';
import { useAccount } from 'wagmi';
import { Property, PropertyBlockchainState, RentTokenPhase } from '@/types/api';
import { 
  useRentTokenBalance, 
  useRentTokenPhase, 
  useRentTokenClaimable 
} from './index';

// 单个property的区块链状态hook
function usePropertyBlockchainState(property: Property, enabled: boolean = true) {
  const { address } = useAccount();
  const rentTokenAddress = property.renTokenAddress as Address | undefined;
  
  // 获取用户余额
  const balance = useRentTokenBalance(rentTokenAddress, enabled && !!address);
  
  // 获取合约阶段
  const phase = useRentTokenPhase(rentTokenAddress, enabled);
  
  // 获取可领取收益
  const claimable = useRentTokenClaimable(rentTokenAddress, enabled && !!address);
  
  // 组装区块链状态
  const blockchainState = useMemo((): PropertyBlockchainState => {
    return {
      userBalance: balance.isConnected ? {
        balance: balance.balance?.toString() || '0',
        formattedBalance: balance.formattedBalance,
        decimals: balance.decimals,
      } : undefined,
      phase: phase.phaseInfo ? {
        value: phase.phaseInfo.value,
        name: phase.phaseInfo.name,
        description: phase.phaseInfo.description,
        isFundraising: phase.phaseInfo.isFundraising,
        isOperating: phase.phaseInfo.isOperating,
        isMatured: phase.phaseInfo.isMatured,
        isRefunding: phase.phaseInfo.isRefunding,
      } : undefined,
      claimable: claimable.isConnected ? {
        amount: claimable.claimableAmount?.toString() || '0',
        formattedAmount: claimable.formattedClaimableAmount,
        hasClaimableAmount: claimable.hasClaimableAmount,
        payoutTokenAddress: claimable.payoutTokenAddress,
      } : undefined,
      isLoading: balance.isLoading || phase.isLoading || claimable.isLoading,
      isError: balance.isError || phase.isError || claimable.isError,
      lastUpdated: Date.now(),
    };
  }, [
    balance.isConnected, balance.balance, balance.formattedBalance, balance.decimals, balance.isLoading, balance.isError,
    phase.phaseInfo, phase.isLoading, phase.isError,
    claimable.isConnected, claimable.claimableAmount, claimable.formattedClaimableAmount, claimable.hasClaimableAmount, claimable.payoutTokenAddress, claimable.isLoading, claimable.isError
  ]);
  
  return {
    blockchainState,
    refetch: () => {
      balance.refetch();
      phase.refetch();
      claimable.refetch();
    }
  };
}

/**
 * 为properties数组添加区块链状态信息
 * @param properties Property数组
 * @param enabled 是否启用查询，默认为true
 */
export function usePropertiesBlockchainState(properties: Property[], enabled: boolean = true) {
  const [enhancedProperties, setEnhancedProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // 由于React hooks规则，我们需要为每个property创建固定数量的hooks
  // 这里我们限制最多同时处理10个properties，避免hooks数量过多
  const maxProperties = 10;
  const limitedProperties = properties.slice(0, maxProperties);
  
  // 为每个property创建区块链状态查询
  const property0State = usePropertyBlockchainState(limitedProperties[0], enabled && limitedProperties.length > 0);
  const property1State = usePropertyBlockchainState(limitedProperties[1], enabled && limitedProperties.length > 1);
  const property2State = usePropertyBlockchainState(limitedProperties[2], enabled && limitedProperties.length > 2);
  const property3State = usePropertyBlockchainState(limitedProperties[3], enabled && limitedProperties.length > 3);
  const property4State = usePropertyBlockchainState(limitedProperties[4], enabled && limitedProperties.length > 4);
  const property5State = usePropertyBlockchainState(limitedProperties[5], enabled && limitedProperties.length > 5);
  const property6State = usePropertyBlockchainState(limitedProperties[6], enabled && limitedProperties.length > 6);
  const property7State = usePropertyBlockchainState(limitedProperties[7], enabled && limitedProperties.length > 7);
  const property8State = usePropertyBlockchainState(limitedProperties[8], enabled && limitedProperties.length > 8);
  const property9State = usePropertyBlockchainState(limitedProperties[9], enabled && limitedProperties.length > 9);
  
  const propertiesStates = [
    property0State, property1State, property2State, property3State, property4State,
    property5State, property6State, property7State, property8State, property9State
  ];
  
  // 组装增强后的properties数据
  useEffect(() => {
    if (!enabled || properties.length === 0) {
      setEnhancedProperties(properties);
      setIsLoading(false);
      return;
    }
    
    const enhanced = properties.map((property, index) => {
      if (index < maxProperties) {
        const state = propertiesStates[index];
        return {
          ...property,
          blockchainState: state.blockchainState,
        };
      } else {
        // 超过限制的properties不添加区块链状态
        return {
          ...property,
          blockchainState: {
            isLoading: false,
            isError: false,
            lastUpdated: Date.now(),
          } as PropertyBlockchainState,
        };
      }
    });
    
    setEnhancedProperties(enhanced);
    
    // 计算整体加载状态
    const anyLoading = propertiesStates
      .slice(0, Math.min(properties.length, maxProperties))
      .some(state => state.blockchainState.isLoading);
    setIsLoading(anyLoading);
    
  }, [
    properties, enabled,
    property0State.blockchainState, property1State.blockchainState, property2State.blockchainState,
    property3State.blockchainState, property4State.blockchainState, property5State.blockchainState,
    property6State.blockchainState, property7State.blockchainState, property8State.blockchainState,
    property9State.blockchainState,
  ]);
  
  // 刷新所有区块链状态
  const refetchAll = () => {
    propertiesStates.forEach((state, index) => {
      if (index < Math.min(properties.length, maxProperties)) {
        state.refetch();
      }
    });
  };
  
  return {
    // 增强后的properties数据
    enhancedProperties,
    // 区块链数据加载状态
    isBlockchainLoading: isLoading,
    // 刷新所有区块链状态
    refetchBlockchainStates: refetchAll,
    // 支持的最大properties数量
    maxSupportedProperties: maxProperties,
    // 是否所有properties都有区块链状态
    allPropertiesEnhanced: properties.length <= maxProperties,
  };
}
