"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";

type KycStatus = 'none' | 'pending' | 'approved' | 'rejected';

export function useKycStatus() {
  const { address, isConnected } = useAccount();
  const [kycStatus, setKycStatus] = useState<KycStatus>('none');
  const [loading, setLoading] = useState(false);

  const fetchKycStatus = useCallback(async () => {
    if (!isConnected || !address) {
      setKycStatus('none');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/kyc?address=${encodeURIComponent(address)}`);
      const result = await response.json();
      
      if (result.success) {
        setKycStatus(result.data.status);
      } else {
        console.error('获取KYC状态失败:', result.error);
        setKycStatus('none');
      }
    } catch (error) {
      console.error('KYC状态查询错误:', error);
      setKycStatus('none');
    } finally {
      setLoading(false);
    }
  }, [address, isConnected]);

  useEffect(() => {
    fetchKycStatus();
  }, [fetchKycStatus]);

  return {
    kycStatus,
    loading,
    isKycVerified: kycStatus === 'approved',
    needsKycVerification: isConnected && kycStatus === 'none',
    refetch: fetchKycStatus,
  };
}
