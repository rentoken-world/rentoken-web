/*
 * @Author: dreamworks.cnn@gmail.com
 * @Date: 2025-08-21 21:15:10
 * @LastEditors: dreamworks.cnn@gmail.com
 * @LastEditTime: 2025-08-22 01:59:17
 * @FilePath: /rentoken-web/src/hooks/useInvest.ts
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
/**
 * useInvest
 * 用户购买某个房产，
 * 在点击src/components/PropertyCard.tsx 组件的
 *            <Button
                variant="sushi"
                onClick={handleInvest}
                disabled={isInvesting || !isConnected}
                className="flex-1"
              >
                {isInvesting ? "🔄 Investing..." : isConnected ? "🚀 Confirm Investment" : "🔒 Connect Wallet"}
              </Button>
 * 时，调用该hook 发起购买

              
 * 
 */

import { useCallback, useState, useEffect } from "react";
import { parseUnits, formatUnits, type Address } from "viem";
import { 
  useAccount, 
  useWalletClient, 
  usePublicClient, 
  useReadContract, 
  useWriteContract,
  useWaitForTransactionReceipt,
  useChainId
} from "wagmi";
import RentTokenABI from "_commons_/ABI/RentToken.json";
import USDCABI from "_commons_/ABI/USDC.json";
import { getContractAddresses } from "@/config/contracts";
import { getSupportedChains } from "@/config/chains";

// 获取合约地址配置
const contractAddresses = getContractAddresses();

// 你需要根据实际部署的合约地址进行替换
const RENT_TOKEN_ADDRESS_MAP: Record<string, Address> = {
  // propertyId: contractAddress
  // 例如: "1": "0x1234567890abcdef...",
};

// 使用配置中的USDC地址，如果没有则使用主网地址作为fallback  
const USDC_ADDRESS = ((contractAddresses as any).USDC_ADDR || "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48") as Address;

export function useInvest(propertyId: string, contributeAmount: number, rentTokenAddress: `0x${string}`) {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const chainId = useChainId();
  
  // 获取当前链信息
  const supportedChains = getSupportedChains();
  const currentChain = supportedChains.find(chain => chain.id === chainId) || supportedChains[0];
  
  const [isInvesting, setIsInvesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [balance, setBalance] = useState<string>("0");
  const [txHash, setTxHash] = useState<string>("");

  // 获取对应房产的RentToken合约地址
  // const rentTokenAddress = RENT_TOKEN_ADDRESS_MAP[propertyId] as Address;

  // 读取USDC精度
  const { data: usdcDecimals } = useReadContract({
    address: USDC_ADDRESS,
    abi: USDCABI as any,
    functionName: 'decimals',
  });
  console.log('usdcDecimals', usdcDecimals,USDC_ADDRESS)
  
  // 读取当前用户的RentToken余额
  const { data: currentBalance, refetch: refetchBalance } = useReadContract({
    address: rentTokenAddress,
    abi: RentTokenABI as any,
    functionName: 'balanceOf',
    args: [address],
    query: {
      enabled: !!address && !!rentTokenAddress,
    },
  });

  // 读取当前授权额度
  const { data: currentAllowance, refetch: refetchAllowance } = useReadContract({
    address: USDC_ADDRESS,
    abi: USDCABI as any,
    functionName: 'allowance',
    args: [address, rentTokenAddress],
    query: {
      enabled: !!address && !!rentTokenAddress,
    },
  });

  // 监听交易状态
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}`,
    query: {
      enabled: !!txHash,
    },
  });

  // 购买函数
  const invest = useCallback(async () => {
    setError(null);
    setSuccess(false);
    setTxHash("");
    
    if (!walletClient || !address || !publicClient) {
      setError("请先连接钱包");
      return;
    }
    
    if (!rentTokenAddress) {
      setError("未找到对应房产的合约地址");
      return;
    }

    if (!usdcDecimals) {
      setError("无法获取USDC精度信息");
      return;
    }

    setIsInvesting(true);
    
    try {
      const amount = parseUnits(contributeAmount.toString(), Number(usdcDecimals));
      
      // 检查是否需要授权
      const needsApproval = !currentAllowance || (currentAllowance as bigint) < amount;
      
      if (needsApproval) {
        console.log("需要授权USDC...");
        console.log("amount", amount);
        console.log("rentTokenAddress", rentTokenAddress);
        console.log("USDC_ADDRESS", USDC_ADDRESS);
        console.log("address", address);
        console.log("currentChain", currentChain);
        // 1. USDC授权
        const approveTxHash = await writeContractAsync({
          address: USDC_ADDRESS,
          abi: USDCABI as any,
          functionName: 'approve',
          args: ["0x6E0D1a311Db4525e0953A751EA32E810c6E464C8", amount],
          account: address!,
          chain: currentChain,
        });

        console.log("授权交易哈希:", approveTxHash);

        // 等待授权交易确认
        const approveReceipt = await publicClient.waitForTransactionReceipt({ 
          hash: approveTxHash 
        });
        
        if (approveReceipt.status !== 'success') {
          throw new Error("授权交易失败");
        }

        // 刷新授权额度
        await refetchAllowance();
        console.log("USDC授权成功");
      }

      console.log("开始投资...");
      
      // 2. 调用rentToken.contribute
      const contributeTxHash = await writeContractAsync({
        address: rentTokenAddress,
        abi: RentTokenABI as any,
        functionName: 'contribute',
        args: [amount],
        account: address!,
        chain: currentChain,
      });

      console.log("投资交易哈希:", contributeTxHash);
      setTxHash(contributeTxHash);

      // 等待投资交易确认
      const contributeReceipt = await publicClient.waitForTransactionReceipt({ 
        hash: contributeTxHash 
      });
      
      if (contributeReceipt.status !== 'success') {
        throw new Error("投资交易失败");
      }

      // 3. 刷新余额
      await refreshBalance();
      setSuccess(true);
      console.log("投资成功完成");

    } catch (e: any) {
      console.error('Investment error:', e);
      
      // 处理 viem 错误格式
      let errorMessage = "投资失败";
      if (e?.shortMessage) {
        errorMessage = e.shortMessage;
      } else if (e?.message) {
        errorMessage = e.message;
      } else if (e?.details) {
        errorMessage = e.details;
      } else if (e?.cause?.reason) {
        errorMessage = e.cause.reason;
      }
      
      setError(errorMessage);
    } finally {
      setIsInvesting(false);
    }
  }, [
    walletClient, 
    address, 
    publicClient, 
    rentTokenAddress, 
    contributeAmount, 
    usdcDecimals, 
    currentAllowance, 
    writeContractAsync,
    refetchAllowance,
  ]);

  // 刷新余额的方法
  const refreshBalance = useCallback(async () => {
    if (!address || !rentTokenAddress || !usdcDecimals) return;
    
    try {
      const result = await refetchBalance();
      
      if (result.data) {
        const formattedBalance = formatUnits(result.data as bigint, Number(usdcDecimals));
        setBalance(formattedBalance);
        return formattedBalance;
      }
    } catch (error) {
      console.error('刷新余额失败:', error);
    }
    
    return balance;
  }, [address, rentTokenAddress, usdcDecimals, refetchBalance, balance]);

  // 初始化和更新余额显示
  useEffect(() => {
    if (currentBalance && usdcDecimals) {
      const formattedBalance = formatUnits(currentBalance as bigint, Number(usdcDecimals));
      setBalance(formattedBalance);
    }
  }, [currentBalance, usdcDecimals]);

  // 当交易确认时，刷新余额
  useEffect(() => {
    if (isConfirmed && txHash) {
      refreshBalance();
    }
  }, [isConfirmed, txHash, refreshBalance]);

  return {
    invest,
    isInvesting: isInvesting || isConfirming,
    error,
    success,
    balance,
    refreshBalance,
    // 额外暴露一些有用的状态
    rentTokenAddress,
    usdcDecimals,
    currentAllowance: currentAllowance && usdcDecimals 
      ? formatUnits(currentAllowance as bigint, Number(usdcDecimals)) 
      : "0",
    isConfirming,
    txHash,
    // 便于调试的状态
    isConnected: !!address && !!walletClient,
    hasValidRentTokenAddress: !!rentTokenAddress,
  };
}