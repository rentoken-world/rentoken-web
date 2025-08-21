/*
 * @Author: dreamworks.cnn@gmail.com
 * @Date: 2025-08-21 16:28:59
 * @LastEditors: dreamworks.cnn@gmail.com
 * @LastEditTime: 2025-08-21 23:31:14
 * @FilePath: /rentoken-web/src/app/api/kyc/route.ts
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { getContractAddress, getCurrentEnvironment } from '@/config/contracts';
import { getSupportedChains } from '@/config/chains';
import KycOracleABI from '../../../../_commons_/ABI/KYCOracle.json';

// KYC状态查询接口 - 直接调用合约
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const walletAddress = searchParams.get('address');

    if (!walletAddress) {
      return NextResponse.json(
        { success: false, error: 'Wallet address parameter is required' },
        { status: 400 }
      );
    }

    // 获取当前链配置
    const chains = getSupportedChains();
    const currentChain = chains[0]; // 使用第一个链作为默认链

    // 创建公共客户端
    const publicClient = createPublicClient({
      chain: currentChain,
      transport: http(),
    });

    // 调用KYC Oracle合约的isWhitelisted方法
    const isWhitelisted = await publicClient.readContract({
      address: getContractAddress('KYC_ORACLE_ADDR') as `0x${string}`,
      abi: KycOracleABI,
      functionName: 'isWhitelisted',
      args: [walletAddress as `0x${string}`],
    });

    return NextResponse.json({
      success: true,
      data: {
        address: walletAddress,
        status: isWhitelisted ? 'approved' : 'none',
        isWhitelisted: Boolean(isWhitelisted),
      },
    });
  } catch (error) {
    console.error('Error fetching KYC status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch KYC status from contract' },
      { status: 500 }
    );
  }
}
