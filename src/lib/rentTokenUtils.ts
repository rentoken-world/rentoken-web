/*
 * @Author: dreamworks.cnn@gmail.com
 * @Date: 2025-08-23 22:30:00
 * @LastEditors: dreamworks.cnn@gmail.com
 * @LastEditTime: 2025-08-23 22:37:02
 * @FilePath: /rentoken-web/src/lib/rentTokenUtils.ts
 * @Description: RentToken合约操作工具函数
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */

import { createPublicClient, http, formatUnits, type Address, type PublicClient } from 'viem';
import { mainnet, sepolia, localhost } from 'viem/chains';
import RentTokenABI from '_commons_/ABI/RentToken.json';

// RentToken阶段枚举
export enum RentTokenPhase {
  FUNDRAISING = 0,    // 募资阶段
  OPERATING = 1,      // 运营阶段
  MATURED = 2,        // 成熟阶段
  REFUNDING = 3,      // 退款阶段
}

// 阶段描述映射
export const PHASE_DESCRIPTIONS: Record<RentTokenPhase, string> = {
  [RentTokenPhase.FUNDRAISING]: '募资阶段',
  [RentTokenPhase.OPERATING]: '运营阶段',
  [RentTokenPhase.MATURED]: '成熟阶段',
  [RentTokenPhase.REFUNDING]: '退款阶段',
};

// 支持的链配置
const CHAIN_CONFIG = {
  1: { chain: mainnet, rpc: 'https://eth-mainnet.g.alchemy.com/v2/' + process.env.NEXT_PUBLIC_ALCHEMY_KEY },
  11155111: { chain: sepolia, rpc: 'https://eth-sepolia.public.blastapi.io '},
  31337: { chain: localhost, rpc: 'http://127.0.0.1:8545' },
};

/**
 * 获取公共客户端
 */
function getPublicClient(chainId: number = 31337): PublicClient {
  const config = CHAIN_CONFIG[chainId as keyof typeof CHAIN_CONFIG] || CHAIN_CONFIG[31337];
  
  return createPublicClient({
    chain: config.chain,
    transport: http(config.rpc),
  });
}

/**
 * 获取用户在RentToken合约中的余额
 * @param rentTokenAddress RentToken合约地址
 * @param userAddress 用户地址
 * @param chainId 链ID，默认为31337（本地链）
 * @returns Promise<{balance: bigint, formattedBalance: string, decimals: number}>
 */
export async function getRentTokenBalance(
  rentTokenAddress: Address,
  userAddress: Address,
  chainId: number = 31337
): Promise<{
  balance: bigint;
  formattedBalance: string;
  decimals: number;
  success: boolean;
  error?: string;
}> {
  try {
    if (!rentTokenAddress || rentTokenAddress === "0x0000000000000000000000000000000000000000") {
      throw new Error('Invalid RentToken address');
    }

    if (!userAddress || userAddress === "0x0000000000000000000000000000000000000000") {
      throw new Error('Invalid user address');
    }

    const publicClient = getPublicClient(chainId);

    // 并行获取余额和精度
    const [balance, decimals] = await Promise.all([
      publicClient.readContract({
        address: rentTokenAddress,
        abi: RentTokenABI,
        functionName: 'balanceOf',
        args: [userAddress],
      }) as Promise<bigint>,
      
      publicClient.readContract({
        address: rentTokenAddress,
        abi: RentTokenABI,
        functionName: 'decimals',
      }) as Promise<number>
    ]);

    const formattedBalance = formatUnits(balance, decimals);

    return {
      balance,
      formattedBalance,
      decimals,
      success: true,
    };

  } catch (error) {
    console.error('获取RentToken余额失败:', error);
    return {
      balance: 0n,
      formattedBalance: '0',
      decimals: 18,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 获取RentToken合约的当前阶段
 * @param rentTokenAddress RentToken合约地址
 * @param chainId 链ID，默认为31337（本地链）
 * @returns Promise<{phase: RentTokenPhase, description: string, success: boolean}>
 */
export async function getRentTokenPhase(
  rentTokenAddress: Address,
  chainId: number = 31337
): Promise<{
  phase: RentTokenPhase;
  name: string;
  description: string;
  isFundraising: boolean;
  isOperating: boolean;
  isMatured: boolean;
  isRefunding: boolean;
  success: boolean;
  error?: string;
}> {
  try {
    if (!rentTokenAddress || rentTokenAddress === "0x0000000000000000000000000000000000000000") {
      throw new Error('Invalid RentToken address');
    }

    const publicClient = getPublicClient(chainId);

    const phaseValue = await publicClient.readContract({
      address: rentTokenAddress,
      abi: RentTokenABI,
      functionName: 'getPhase',
    }) as number;

    const phase = phaseValue as RentTokenPhase;
    const description = PHASE_DESCRIPTIONS[phase] || '未知阶段';
    const name = RentTokenPhase[phase] || 'UNKNOWN';

    return {
      phase,
      name,
      description,
      isFundraising: phase === RentTokenPhase.FUNDRAISING,
      isOperating: phase === RentTokenPhase.OPERATING,
      isMatured: phase === RentTokenPhase.MATURED,
      isRefunding: phase === RentTokenPhase.REFUNDING,
      success: true,
    };

  } catch (error) {
    console.error('获取RentToken阶段失败:', error);
    return {
      phase: RentTokenPhase.FUNDRAISING,
      name: 'FUNDRAISING',
      description: '获取失败',
      isFundraising: false,
      isOperating: false,
      isMatured: false,
      isRefunding: false,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 获取用户在RentToken合约中的可领取收益
 * @param rentTokenAddress RentToken合约地址
 * @param userAddress 用户地址
 * @param chainId 链ID，默认为31337（本地链）
 * @returns Promise<{claimableAmount: bigint, formattedAmount: string, hasClaimableAmount: boolean}>
 */
export async function getRentTokenClaimable(
  rentTokenAddress: Address,
  userAddress: Address,
  chainId: number = 31337
): Promise<{
  claimableAmount: bigint;
  formattedAmount: string;
  hasClaimableAmount: boolean;
  payoutTokenAddress?: Address;
  payoutTokenDecimals?: number;
  success: boolean;
  error?: string;
}> {
  try {
    if (!rentTokenAddress || rentTokenAddress === "0x0000000000000000000000000000000000000000") {
      throw new Error('Invalid RentToken address');
    }

    if (!userAddress || userAddress === "0x0000000000000000000000000000000000000000") {
      throw new Error('Invalid user address');
    }

    const publicClient = getPublicClient(chainId);

    // 获取可领取金额和支付代币地址
    const [claimableAmount, payoutTokenAddress] = await Promise.all([
      publicClient.readContract({
        address: rentTokenAddress,
        abi: RentTokenABI,
        functionName: 'claimable',
        args: [userAddress],
      }) as Promise<bigint>,
      
      publicClient.readContract({
        address: rentTokenAddress,
        abi: RentTokenABI,
        functionName: 'payoutToken',
      }) as Promise<Address>
    ]);

    let payoutTokenDecimals = 18; // 默认精度
    let formattedAmount = '0';

    // 如果有可领取金额，获取支付代币的精度
    if (claimableAmount > 0n && payoutTokenAddress && payoutTokenAddress !== "0x0000000000000000000000000000000000000000") {
      try {
        payoutTokenDecimals = await publicClient.readContract({
          address: payoutTokenAddress,
          abi: [
            {
              type: 'function',
              name: 'decimals',
              inputs: [],
              outputs: [{ name: '', type: 'uint8', internalType: 'uint8' }],
              stateMutability: 'view',
            },
          ],
          functionName: 'decimals',
        }) as number;
      } catch (decimalsError) {
        console.warn('获取支付代币精度失败，使用默认值18:', decimalsError);
      }
    }

    formattedAmount = formatUnits(claimableAmount, payoutTokenDecimals);
    const hasClaimableAmount = claimableAmount > 0n;

    return {
      claimableAmount,
      formattedAmount,
      hasClaimableAmount,
      payoutTokenAddress: payoutTokenAddress !== "0x0000000000000000000000000000000000000000" ? payoutTokenAddress : undefined,
      payoutTokenDecimals,
      success: true,
    };

  } catch (error) {
    console.error('获取RentToken可领取收益失败:', error);
    return {
      claimableAmount: 0n,
      formattedAmount: '0',
      hasClaimableAmount: false,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 批量获取多个RentToken合约的所有状态信息
 * @param rentTokenAddresses RentToken合约地址数组
 * @param userAddress 用户地址
 * @param chainId 链ID，默认为31337（本地链）
 * @returns Promise<RentTokenStatus[]>
 */
export interface RentTokenStatus {
  rentTokenAddress: Address;
  balance: {
    balance: bigint;
    formattedBalance: string;
    decimals: number;
    success: boolean;
    error?: string;
  };
  phase: {
    phase: RentTokenPhase;
    name: string;
    description: string;
    isFundraising: boolean;
    isOperating: boolean;
    isMatured: boolean;
    isRefunding: boolean;
    success: boolean;
    error?: string;
  };
  claimable: {
    claimableAmount: bigint;
    formattedAmount: string;
    hasClaimableAmount: boolean;
    payoutTokenAddress?: Address;
    payoutTokenDecimals?: number;
    success: boolean;
    error?: string;
  };
  overallSuccess: boolean;
}

export async function getBatchRentTokenStatus(
  rentTokenAddresses: Address[],
  userAddress: Address,
  chainId: number = 31337
): Promise<RentTokenStatus[]> {
  const results = await Promise.allSettled(
    rentTokenAddresses.map(async (address) => {
      const [balance, phase, claimable] = await Promise.allSettled([
        getRentTokenBalance(address, userAddress, chainId),
        getRentTokenPhase(address, chainId),
        getRentTokenClaimable(address, userAddress, chainId),
      ]);

      return {
        rentTokenAddress: address,
        balance: balance.status === 'fulfilled' ? balance.value : {
          balance: 0n,
          formattedBalance: '0',
          decimals: 18,
          success: false,
          error: balance.status === 'rejected' ? balance.reason.message : 'Unknown error',
        },
        phase: phase.status === 'fulfilled' ? phase.value : {
          phase: RentTokenPhase.FUNDRAISING,
          name: 'FUNDRAISING',
          description: '获取失败',
          isFundraising: false,
          isOperating: false,
          isMatured: false,
          isRefunding: false,
          success: false,
          error: phase.status === 'rejected' ? phase.reason.message : 'Unknown error',
        },
        claimable: claimable.status === 'fulfilled' ? claimable.value : {
          claimableAmount: 0n,
          formattedAmount: '0',
          hasClaimableAmount: false,
          success: false,
          error: claimable.status === 'rejected' ? claimable.reason.message : 'Unknown error',
        },
        overallSuccess: balance.status === 'fulfilled' && phase.status === 'fulfilled' && claimable.status === 'fulfilled',
      } as RentTokenStatus;
    })
  );

  return results.map(result => 
    result.status === 'fulfilled' ? result.value : {
      rentTokenAddress: '0x0000000000000000000000000000000000000000' as Address,
      balance: { balance: 0n, formattedBalance: '0', decimals: 18, success: false, error: 'Batch operation failed' },
      phase: { phase: RentTokenPhase.FUNDRAISING, name: 'FUNDRAISING', description: '获取失败', isFundraising: false, isOperating: false, isMatured: false, isRefunding: false, success: false, error: 'Batch operation failed' },
      claimable: { claimableAmount: 0n, formattedAmount: '0', hasClaimableAmount: false, success: false, error: 'Batch operation failed' },
      overallSuccess: false,
    } as RentTokenStatus
  );
}
