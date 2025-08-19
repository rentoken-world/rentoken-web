"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";

// Mock KYC 状态 - 实际项目中这应该从后端API获取
const mockKycStatus = {
  "0x1234567890123456789012345678901234567890": true,
  "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd": false,
};

export function useKycStatus() {
  const { address, isConnected } = useAccount();
  const [kycStatus, setKycStatus] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isConnected && address) {
      setLoading(true);
      // 模拟API调用延迟
      setTimeout(() => {
        const status = mockKycStatus[address as keyof typeof mockKycStatus] ?? false;
        setKycStatus(status);
        setLoading(false);
      }, 1000);
    } else {
      setKycStatus(null);
      setLoading(false);
    }
  }, [address, isConnected]);

  return {
    kycStatus,
    loading,
    isKycVerified: kycStatus === true,
    needsKycVerification: isConnected && kycStatus === false,
  };
}
