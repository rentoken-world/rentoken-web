/*
 * @Author: dreamworks.cnn@gmail.com
 * @Date: 2025-08-20 17:26:56
 * @LastEditors: dreamworks.cnn@gmail.com
 * @LastEditTime: 2025-08-23 15:10:18
 * @FilePath: /rentoken-web/src/hooks/useProperties.ts
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Property, PaginatedResponse, ApiResponse, PaginationParams } from '@/types/api';
import { usePropertiesBlockchainState } from './usePropertiesBlockchainState';

export function useProperties(params: PaginationParams = {}) {
  const [baseData, setBaseData] = useState<PaginatedResponse<Property> | null>(null);
  const [apiLoading, setApiLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // 使用区块链状态hook来增强properties数据
  const {
    enhancedProperties,
    isBlockchainLoading,
    refetchBlockchainStates,
    maxSupportedProperties,
    allPropertiesEnhanced
  } = usePropertiesBlockchainState(
    baseData?.data || [], 
    !apiLoading && !!baseData // 只有在API数据加载完成后才启用区块链查询
  );

  // 组装最终的增强数据
  const enhancedData = baseData ? {
    ...baseData,
    data: enhancedProperties
  } : null;

  // 综合加载状态：API加载 或 区块链数据加载
  const loading = apiLoading || (enhancedProperties.length > 0 && isBlockchainLoading);

  // 刷新所有数据的方法
  const refetchAll = useCallback(() => {
    fetchProperties();
    if (!apiLoading) {
      refetchBlockchainStates();
    }
  }, [fetchProperties, apiLoading, refetchBlockchainStates]);

  return {
    // 增强后的数据（包含区块链状态）
    data: enhancedData,
    // 加载状态
    loading,
    // API加载状态
    apiLoading,
    // 区块链数据加载状态
    blockchainLoading: isBlockchainLoading,
    // 错误状态
    error,
    // 刷新方法
    refetch: refetchAll,
    refetchApi: fetchProperties,
    refetchBlockchain: refetchBlockchainStates,
    // 区块链状态相关信息
    maxSupportedProperties,
    allPropertiesEnhanced,
    // 统计信息
    stats: {
      totalProperties: baseData?.pagination.total || 0,
      propertiesWithBlockchainData: enhancedProperties.filter(p => p.blockchainState && !p.blockchainState.isError).length,
      propertiesInFunding: enhancedProperties.filter(p => p.blockchainState?.phase?.isFundraising).length,
      propertiesOperating: enhancedProperties.filter(p => p.blockchainState?.phase?.isOperating).length,
    }
  };
}
