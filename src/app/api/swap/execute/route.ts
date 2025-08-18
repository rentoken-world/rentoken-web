import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAuth, createAuthResponse } from '@/lib/auth';
import { z } from 'zod';

const executeSwapSchema = z.object({
  fromToken: z.string(),
  toToken: z.string(),
  fromAmount: z.number().min(0.000001, '交易金额必须大于0'),
  minReceived: z.number().min(0, '最小接收数量不能为负数'),
  slippageTolerance: z.number().min(0).optional()
});

// 模拟获取用户余额
async function getUserBalance(userId: string, tokenId: string): Promise<number> {
  // 模拟余额数据
  const mockBalances: Record<string, number> = {
    'eth': 5.2341,
    'usdc': 12450.00,
    'rwa-nyc': 850.30,
    'rwa-london': 420.15,
    'rwa-tokyo': 1250.75
  };
  
  return mockBalances[tokenId] || 0;
}

// 模拟获取交易报价
async function getQuote(fromToken: string, toToken: string, amount: number) {
  const mockTokens: Record<string, { price: number; volume24h: number }> = {
    'eth': { price: 2340.50, volume24h: 1250000 },
    'usdc': { price: 1.00, volume24h: 890000 },
    'rwa-nyc': { price: 125.80, volume24h: 45000 },
    'rwa-london': { price: 89.25, volume24h: 28000 },
    'rwa-tokyo': { price: 67.40, volume24h: 67000 }
  };

  const fromTokenData = mockTokens[fromToken];
  const toTokenData = mockTokens[toToken];
  
  if (!fromTokenData || !toTokenData) {
    throw new Error('代币不存在');
  }

  const rate = fromTokenData.price / toTokenData.price;
  const fee = 0.003; // 0.3% 手续费
  const slippage = Math.min((amount / (fromTokenData.volume24h * 10)) * 0.1, 0.05);
  
  return {
    outputAmount: amount * rate * (1 - fee) * (1 - slippage),
    fee: fee * 100,
    slippage: slippage * 100
  };
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return createAuthResponse(401, '未授权访问');
    }

    const body = await request.json();
    const validatedData = executeSwapSchema.parse(body);

    // 验证用户余额
    const fromTokenBalance = await getUserBalance(user.sub, validatedData.fromToken);

    if (fromTokenBalance < validatedData.fromAmount) {
      return createAuthResponse(400, '余额不足');
    }

    // 获取最新报价
    const quote = await getQuote(
      validatedData.fromToken,
      validatedData.toToken,
      validatedData.fromAmount
    );

    // 检查滑点容忍度
    if (quote.outputAmount < validatedData.minReceived) {
      return createAuthResponse(400, '滑点超过容忍范围');
    }

    // 模拟区块链交易
    const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;

    // 创建交换记录
    const swap = await prisma.swaps.create({
      data: {
        userId: user.sub,
        fromToken: validatedData.fromToken,
        toToken: validatedData.toToken,
        fromAmount: validatedData.fromAmount,
        toAmount: quote.outputAmount,
        fee: quote.fee,
        slippage: quote.slippage,
        transactionHash,
        status: 'completed',
        createdAt: new Date()
      }
    });

    return createAuthResponse(200, '交易成功', {
      swap: {
        id: swap.id,
        transactionHash,
        fromAmount: validatedData.fromAmount,
        toAmount: quote.outputAmount,
        fee: quote.fee,
        completedAt: new Date()
      }
    });

  } catch (error) {
    console.error('Execute swap error:', error);
    
    if (error instanceof z.ZodError) {
      return createAuthResponse(400, '数据验证失败', {
        errors: error.issues
      });
    }
    
    return createAuthResponse(500, '服务器内部错误');
  }
}
