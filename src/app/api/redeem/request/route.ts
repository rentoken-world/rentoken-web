import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAuth, createAuthResponse } from '@/lib/auth';
import { z } from 'zod';

const createRedemptionSchema = z.object({
  assetId: z.string(),
  tokenAmount: z.number().min(0.000001, '赎回数量必须大于0'),
  isEarlyRedeem: z.boolean(),
  reason: z.string().optional()
});

// 模拟资产数据和计算
const mockAssets = [
  {
    id: '1',
    redemptionRatio: 125.80,
    penaltyRate: 0.15,
    isLocked: true,
    balance: 850.30,
    availableAmount: 350.30
  },
  {
    id: '2',
    redemptionRatio: 89.25,
    penaltyRate: 0,
    isLocked: false,
    balance: 420.15,
    availableAmount: 420.15
  },
  {
    id: '3',
    redemptionRatio: 67.40,
    penaltyRate: 0.12,
    isLocked: true,
    balance: 1250.75,
    availableAmount: 450.75
  }
];

function calculateRedemptionValue(assetId: string, tokenAmount: number, isEarlyRedeem: boolean) {
  const asset = mockAssets.find(a => a.id === assetId);
  if (!asset) throw new Error('资产不存在');

  const baseValue = tokenAmount * asset.redemptionRatio;
  let penalty = 0;
  let processingFee = baseValue * 0.005;
  
  if (isEarlyRedeem && asset.isLocked) {
    penalty = baseValue * asset.penaltyRate;
  }

  const finalValue = baseValue - penalty - processingFee;
  const estimatedDays = isEarlyRedeem ? 1 : 3;
  const completionDate = new Date(Date.now() + estimatedDays * 24 * 60 * 60 * 1000);

  return {
    baseValue,
    penalty,
    processingFee,
    finalValue,
    estimatedCompletionDate: completionDate
  };
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return createAuthResponse(401, '未授权访问');
    }

    const body = await request.json();
    const validatedData = createRedemptionSchema.parse(body);

    const asset = mockAssets.find(a => a.id === validatedData.assetId);
    if (!asset) {
      return createAuthResponse(404, '资产不存在');
    }

    const maxRedeemable = validatedData.isEarlyRedeem ? asset.balance : asset.availableAmount;
    
    if (validatedData.tokenAmount > maxRedeemable) {
      return createAuthResponse(400, '赎回数量超过可用余额');
    }

    // 计算赎回价值
    const calculation = calculateRedemptionValue(
      validatedData.assetId,
      validatedData.tokenAmount,
      validatedData.isEarlyRedeem
    );

    // 创建赎回申请记录
    const redemption = await prisma.redemptions.create({
      data: {
        userId: user.sub,
        assetId: validatedData.assetId,
        tokenAmount: validatedData.tokenAmount,
        baseValue: calculation.baseValue,
        penalty: calculation.penalty,
        processingFee: calculation.processingFee,
        finalValue: calculation.finalValue,
        isEarlyRedeem: validatedData.isEarlyRedeem,
        status: 'pending',
        estimatedCompletionDate: calculation.estimatedCompletionDate,
        createdAt: new Date()
      }
    });

    return createAuthResponse(200, '赎回申请已提交', {
      redemption: {
        id: redemption.id,
        ...calculation,
        status: 'pending',
        submittedAt: redemption.createdAt
      }
    });

  } catch (error) {
    console.error('Create redemption error:', error);
    
    if (error instanceof z.ZodError) {
      return createAuthResponse(400, '数据验证失败', {
        errors: error.issues
      });
    }
    
    return createAuthResponse(500, '服务器内部错误');
  }
}
