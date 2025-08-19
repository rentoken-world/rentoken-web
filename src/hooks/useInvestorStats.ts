"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { InvestorStats, ApiResponse } from '@/types/api';

export function useInvestorStats() {
  const { address, isConnected } = useAccount();
  const [data, setData] = useState<InvestorStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!address || !isConnected) {
      setData(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/investor/stats?address=${address}`);
      const result: ApiResponse<InvestorStats> = await response.json();

      if (result.success && result.data) {
        setData(result.data);
      } else {
        setError(result.error || 'Failed to fetch investor statistics');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching investor stats:', err);
    } finally {
      setLoading(false);
    }
  }, [address, isConnected]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    data,
    loading,
    error,
    refetch: fetchStats,
  };
}
