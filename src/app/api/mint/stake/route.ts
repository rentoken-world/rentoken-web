import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAuth, createAuthResponse } from '@/lib/auth';
import { z } from 'zod';

const createStakeSchema = z.object({
  assetId: z.string(),
  amount: z.number().min(1000, '最小质押金额为 $1,000'),
  lockPeriod: z.number().refine(val => [3, 6, 12, 24].includes(val), '锁定期限必须为 3、6、12 或 24 个月')
});

// 模拟计算质押价值
async function calculateStakeValue(assetId: string, amount: number, lockPeriod: number) {
  const asset = { tokenRatio: 1000, yieldRate: 6.35 }; // 简化的资产数据
  
  const baseTokens = amount * asset.tokenRatio;
  const lockBonusMap: Record<number, number> = { 3: 1.0, 6: 1.1, 12: 1.25, 24: 1.5 };
  const lockBonus = lockBonusMap[lockPeriod] || 1.0;
  const finalTokens = Math.floor(baseTokens * lockBonus);
  const annualYield = (amount * asset.yieldRate) / 100;
  const expectedYield = (annualYield * lockPeriod) / 12;
  const unlockDate = new Date(Date.now() + lockPeriod * 30 * 24 * 60 * 60 * 1000);

  return {
    finalTokens,
    expectedYield,
    unlockDate
  };
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return createAuthResponse(401, '未授权访问');
    }

    const body = await request.json();
    const validatedData = createStakeSchema.parse(body);

    // 验证用户KYC状态
    const userWithKyc = await prisma.users.findUnique({
      where: { id: user.sub },
      include: { kyc: true }
    });

    if (!userWithKyc?.kyc || userWithKyc.kyc.status !== 'approved') {
      return createAuthResponse(400, '请先完成KYC认证');
    }

    // 计算质押价值
    const calculation = await calculateStakeValue(
      validatedData.assetId,
      validatedData.amount,
      validatedData.lockPeriod
    );

    // 创建质押记录
    const stake = await prisma.stakes.create({
      data: {
        userId: user.sub,
        assetId: validatedData.assetId,
        amount: validatedData.amount,
        lockPeriod: validatedData.lockPeriod,
        tokenAmount: calculation.finalTokens,
        expectedYield: calculation.expectedYield,
        unlockDate: calculation.unlockDate,
        status: 'pending',
        createdAt: new Date()
      }
    });

    return createAuthResponse(200, '质押订单已创建', {
      stake: {
        id: stake.id,
        ...calculation,
        status: 'pending'
      }
    });

  } catch (error) {
    console.error('Create stake error:', error);
    
    if (error instanceof z.ZodError) {
      return createAuthResponse(400, '数据验证失败', {
        errors: error.issues
      });
    }
    
    return createAuthResponse(500, '服务器内部错误');
  }
}
