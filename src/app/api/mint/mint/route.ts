import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAuth, createAuthResponse } from '@/lib/auth';
import { z } from 'zod';

const mintTokenSchema = z.object({
  stakeId: z.string()
});

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return createAuthResponse(401, '未授权访问');
    }

    const body = await request.json();
    const validatedData = mintTokenSchema.parse(body);

    // 获取质押记录
    const stake = await prisma.stakes.findFirst({
      where: {
        id: validatedData.stakeId,
        userId: user.sub,
        status: 'pending'
      }
    });

    if (!stake) {
      return createAuthResponse(404, '质押记录不存在或已处理');
    }

    // 模拟区块链交易确认
    const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;

    // 更新质押状态
    const updatedStake = await prisma.stakes.update({
      where: { id: stake.id },
      data: {
        status: 'active',
        transactionHash,
        confirmedAt: new Date()
      }
    });

    // 创建代币余额记录
    const existingBalance = await prisma.tokenBalances.findFirst({
      where: {
        userId: user.sub,
        assetId: stake.assetId
      }
    });

    if (existingBalance) {
      await prisma.tokenBalances.update({
        where: { id: existingBalance.id },
        data: {
          balance: existingBalance.balance + stake.tokenAmount
        }
      });
    } else {
      await prisma.tokenBalances.create({
        data: {
          userId: user.sub,
          assetId: stake.assetId,
          balance: stake.tokenAmount
        }
      });
    }

    return createAuthResponse(200, '代币铸造成功', {
      result: {
        stakeId: stake.id,
        tokenAmount: stake.tokenAmount,
        transactionHash,
        confirmedAt: updatedStake.confirmedAt
      }
    });

  } catch (error) {
    console.error('Mint tokens error:', error);
    
    if (error instanceof z.ZodError) {
      return createAuthResponse(400, '数据验证失败', {
        errors: error.issues
      });
    }
    
    return createAuthResponse(500, '服务器内部错误');
  }
}
