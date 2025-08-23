"use client";

import { useAccount, useReadContract } from "wagmi";
import { getContractAddress } from "@/config/contracts";
import KycOracleABI from "../../_commons_/ABI/KYCOracle.json";

export function useKycStatus() {
  const { address, isConnected } = useAccount();

  const { 
    data: isWhitelisted, 
    isLoading: loading, 
    refetch 
  } = useReadContract({
    address: getContractAddress('KYC_ORACLE_ADDR') as `0x${string}`,
    abi: KycOracleABI,
    functionName: 'isWhitelisted',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isConnected,
    },
  });

  const isKycVerified = Boolean(isWhitelisted);
  const needsKycVerification = isConnected && !isKycVerified;

  return {
    kycStatus: isKycVerified ? 'approved' as const : 'none' as const,
    loading,
    isKycVerified,
    needsKycVerification,
    refetch,
  };
}
