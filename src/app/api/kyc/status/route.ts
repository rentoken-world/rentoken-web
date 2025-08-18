import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAuth, createAuthResponse } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return createAuthResponse(401, '未授权访问');
    }

    const kyc = await prisma.kyc.findUnique({
      where: { userId: user.sub },
      select: {
        id: true,
        status: true,
        submittedAt: true,
        reviewedAt: true,
        reviewComments: true,
        phone: true,
        email: true,
        walletAddress: true
      }
    });

    if (!kyc) {
      return createAuthResponse(200, '尚未提交KYC申请', {
        status: 'not_submitted'
      });
    }

    return createAuthResponse(200, '获取KYC状态成功', { kyc });

  } catch (error) {
    console.error('Get KYC status error:', error);
    return createAuthResponse(500, '服务器内部错误');
  }
}
