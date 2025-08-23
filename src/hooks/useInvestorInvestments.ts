"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import type { Investment } from "@/types/api";

interface UseInvestorInvestmentsProps {
  page?: number;
  limit?: number;
  propertyId?: string;
  status?: string;
  sortBy?: 'date' | 'amount' | 'tokens';
  sortOrder?: 'asc' | 'desc';
}

interface InvestmentsData {
  data: Investment[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export function useInvestorInvestments(props: UseInvestorInvestmentsProps = {}) {
  const { address, isConnected } = useAccount();
  const [data, setData] = useState<InvestmentsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    page = 1,
    limit = 10,
    propertyId,
    status,
    sortBy = 'date',
    sortOrder = 'desc'
  } = props;

  const fetchInvestments = useCallback(async () => {
    if (!isConnected || !address) {
      setData(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        investorAddress: address,
        sortBy,
        sortOrder,
      });

      if (propertyId) queryParams.set('propertyId', propertyId);
      if (status) queryParams.set('status', status);

      const response = await fetch(`/api/investments?${queryParams}`);
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || '获取投资记录失败');
      }
    } catch (err) {
      console.error('获取投资记录错误:', err);
      setError('获取投资记录失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [address, isConnected, page, limit, propertyId, status, sortBy, sortOrder]);

  useEffect(() => {
    fetchInvestments();
  }, [fetchInvestments]);

  return {
    data,
    loading,
    error,
    refetch: fetchInvestments,
  };
}
