import { NextRequest } from 'next/server';
import { createAuthResponse } from '@/lib/auth';
import { z } from 'zod';

const calculateSchema = z.object({
  assetId: z.string(),
  amount: z.number().min(1000, '最小质押金额为 $1,000'),
  lockPeriod: z.number().refine(val => [3, 6, 12, 24].includes(val), '锁定期限必须为 3、6、12 或 24 个月')
});

// 模拟资产数据获取
async function getAssetById(assetId: string) {
  const assets = [
    {
      id: '1',
      name: '曼哈顿豪华公寓A座',
      estimatedValue: 850000,
      yieldRate: 6.35,
      tokenRatio: 1000,
      availableForStaking: 170000000
    },
    {
      id: '3',
      name: '东京涩谷商业综合体',
      estimatedValue: 2100000,
      yieldRate: 6.85,
      tokenRatio: 1200,
      availableForStaking: 840000000
    }
  ];
  
  return assets.find(a => a.id === assetId);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = calculateSchema.parse(body);

    const asset = await getAssetById(validatedData.assetId);
    if (!asset) {
      return createAuthResponse(404, '资产不存在');
    }

    const baseTokens = validatedData.amount * asset.tokenRatio;
    
    // 根据锁定期限计算奖励倍数
    const lockBonusMap: Record<number, number> = {
      3: 1.0,   // 3个月无奖励
      6: 1.1,   // 6个月 +10%
      12: 1.25, // 12个月 +25%
      24: 1.5   // 24个月 +50%
    };

    const lockBonus = lockBonusMap[validatedData.lockPeriod] || 1.0;
    const finalTokens = Math.floor(baseTokens * lockBonus);

    // 计算预期收益
    const annualYield = (validatedData.amount * asset.yieldRate) / 100;
    const expectedYield = (annualYield * validatedData.lockPeriod) / 12;

    return createAuthResponse(200, '计算成功', {
      calculation: {
        stakeAmount: validatedData.amount,
        baseTokens,
        lockBonus: (lockBonus - 1) * 100, // 转换为百分比
        finalTokens,
        expectedYield,
        annualYieldRate: asset.yieldRate,
        lockPeriod: validatedData.lockPeriod,
        unlockDate: new Date(Date.now() + validatedData.lockPeriod * 30 * 24 * 60 * 60 * 1000)
      }
    });

  } catch (error) {
    console.error('Calculate stake value error:', error);
    
    if (error instanceof z.ZodError) {
      return createAuthResponse(400, '数据验证失败', {
        errors: error.issues
      });
    }
    
    return createAuthResponse(500, '服务器内部错误');
  }
}
