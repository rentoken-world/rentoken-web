/*
 * @Author: dreamworks.cnn@gmail.com
 * @Date: 2025-08-20 17:26:56
 * @LastEditors: dreamworks.cnn@gmail.com
 * @LastEditTime: 2025-08-23 22:45:37
 * @FilePath: /rentoken-web/src/hooks/useProperties.ts
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { type Address } from 'viem';
import { Property, PaginatedResponse, ApiResponse, PaginationParams, PropertyBlockchainState } from '@/types/api';
import { getBatchRentTokenStatus } from '@/lib/utils';

export function useProperties(params: PaginationParams = {}) {
  const [baseData, setBaseData] = useState<PaginatedResponse<Property> | null>(null);
  const [enhancedData, setEnhancedData] = useState<PaginatedResponse<Property> | null>(null);
  const [apiLoading, setApiLoading] = useState(true);
  const [blockchainLoading, setBlockchainLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 获取用户信息和链信息
  const { address } = useAccount();
  const chainId = useChainId();

  // 获取API数据
  const fetchProperties = useCallback(async () => {
    try {
      setApiLoading(true);
      setError(null);

      const searchParams = new URLSearchParams();
      if (params.page) searchParams.set('page', params.page.toString());
      if (params.limit) searchParams.set('limit', params.limit.toString());
      if (params.search) searchParams.set('search', params.search);
      if (params.status) searchParams.set('status', params.status);

      const response = await fetch(`/api/properties?${searchParams.toString()}`);
      const result: ApiResponse<PaginatedResponse<Property>> = await response.json();

      if (result.success && result.data) {
        console.log('result.data', result.data);
        
        // 过滤掉没有有效renTokenAddress的properties
        const filteredData = {
          ...result.data,
          data: result.data?.data?.filter((item) => 
            item.renTokenAddress && 
            item.renTokenAddress !== "0x0000000000000000000000000000000000000000"
          ) || []
        };
        
        setBaseData(filteredData);
        console.log('useProperties.baseData', filteredData);
        
      } else {
        setError(result.error || 'Failed to fetch properties');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching properties:', err);
    } finally {
      setApiLoading(false);
    }
  }, [params.page, params.limit, params.search, params.status]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // 获取区块链状态数据
  const fetchBlockchainStates = useCallback(async (properties: Property[]) => {
    if (!properties.length || !address) {
      console.log('跳过区块链状态获取：', { propertiesLength: properties.length, hasAddress: !!address });
      return properties;
    }

    setBlockchainLoading(true);
    
    try {
      // 过滤出有效的RentToken地址
      const validProperties = properties.filter(p => 
        p.renTokenAddress && 
        p.renTokenAddress !== "0x0000000000000000000000000000000000000000"
      );
      
      if (validProperties.length === 0) {
        console.log('没有有效的RentToken地址');
        return properties;
      }

      console.log('开始获取区块链状态，数量:', validProperties.length);
      
      // 批量获取区块链状态
      const addresses = validProperties.map(p => p.renTokenAddress as Address);
      const blockchainStates = await getBatchRentTokenStatus(addresses, address, chainId);
      
      console.log('区块链状态获取完成:', blockchainStates);

      // 将区块链状态合并到properties中
      const propertiesWithState = properties.map(property => {
        const validIndex = validProperties.findIndex(vp => vp.id === property.id);
        
        if (validIndex === -1) {
          // 没有有效RentToken地址的property
          return {
            ...property,
            blockchainState: {
              isLoading: false,
              isError: false,
              lastUpdated: Date.now(),
            } as PropertyBlockchainState
          };
        }
        
        const status = blockchainStates[validIndex];
        
        return {
          ...property,
          blockchainState: {
            // 用户余额信息
            userBalance: status.balance.success ? {
              balance: status.balance.balance.toString(),
              formattedBalance: status.balance.formattedBalance,
              decimals: status.balance.decimals,
            } : undefined,
            
            // 合约阶段信息
            phase: status.phase.success ? {
              value: status.phase.phase,
              name: status.phase.name,
              description: status.phase.description,
              isFundraising: status.phase.isFundraising,
              isOperating: status.phase.isOperating,
              isMatured: status.phase.isMatured,
              isRefunding: status.phase.isRefunding,
            } : undefined,
            
            // 可领取收益信息
            claimable: status.claimable.success ? {
              amount: status.claimable.claimableAmount.toString(),
              formattedAmount: status.claimable.formattedAmount,
              hasClaimableAmount: status.claimable.hasClaimableAmount,
              payoutTokenAddress: status.claimable.payoutTokenAddress,
            } : undefined,
            
            // 状态元信息
            isLoading: false,
            isError: !status.overallSuccess,
            lastUpdated: Date.now(),
          } as PropertyBlockchainState
        };
      });
      
      return propertiesWithState;
      
    } catch (error) {
      console.error('获取区块链状态失败:', error);
      
      // 返回带有错误状态的properties
      return properties.map(property => ({
        ...property,
        blockchainState: {
          isLoading: false,
          isError: true,
          lastUpdated: Date.now(),
        } as PropertyBlockchainState
      }));
    } finally {
      setBlockchainLoading(false);
    }
  }, [address, chainId]);

  // 当baseData或用户地址变化时，获取区块链状态
  useEffect(() => {
    if (baseData?.data && address) {
      console.log('触发区块链状态获取');
      fetchBlockchainStates(baseData.data).then(enhancedProperties => {
        setEnhancedData({
          ...baseData,
          data: enhancedProperties
        });
      });
    } else if (baseData?.data && !address) {
      // 没有连接钱包时，直接返回不带区块链状态的数据
      setEnhancedData(baseData);
    }
  }, [baseData, address, fetchBlockchainStates]);

  // 刷新区块链状态的方法
  const refetchBlockchainStates = useCallback(() => {
    if (baseData?.data) {
      fetchBlockchainStates(baseData.data).then(enhancedProperties => {
        setEnhancedData({
          ...baseData,
          data: enhancedProperties
        });
      });
    }
  }, [baseData, fetchBlockchainStates]);

  // 刷新所有数据的方法
  const refetchAll = useCallback(() => {
    fetchProperties();
    // API数据刷新后会自动触发区块链状态刷新
  }, [fetchProperties]);

  // 综合加载状态
  const loading = apiLoading || blockchainLoading;

  // 统计信息
  const stats = {
    totalProperties: baseData?.pagination.total || 0,
    propertiesWithBlockchainData: enhancedData?.data.filter(p => p.blockchainState && !p.blockchainState.isError).length || 0,
    propertiesInFunding: enhancedData?.data.filter(p => p.blockchainState?.phase?.isFundraising).length || 0,
    propertiesOperating: enhancedData?.data.filter(p => p.blockchainState?.phase?.isOperating).length || 0,
    propertiesWithBalance: enhancedData?.data.filter(p => p.blockchainState?.userBalance && parseFloat(p.blockchainState.userBalance.formattedBalance) > 0).length || 0,
    propertiesWithClaimable: enhancedData?.data.filter(p => p.blockchainState?.claimable?.hasClaimableAmount).length || 0,
  };
console.log('enhancedData', enhancedData)
  return {
    // 增强后的数据（包含区块链状态）
    data: enhancedData,
    // 加载状态
    loading,
    // API加载状态
    apiLoading,
    // 区块链数据加载状态
    blockchainLoading,
    // 错误状态
    error,
    // 刷新方法
    refetch: refetchAll,
    refetchApi: fetchProperties,
    refetchBlockchain: refetchBlockchainStates,
    // 用户连接状态
    isConnected: !!address,
    // 统计信息
    stats,
  };
}
