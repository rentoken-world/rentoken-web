import { NextRequest } from 'next/server';
import { verifyAuth, createAuthResponse } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return createAuthResponse(401, '未授权访问');
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');

    // 模拟赎回历史数据
    const mockHistory = [
      {
        id: 'redeem_1',
        userId: user.sub,
        assetId: '2',
        tokenAmount: 100,
        baseValue: 8925,
        penalty: 0,
        processingFee: 44.63,
        finalValue: 8880.37,
        isEarlyRedeem: false,
        status: 'completed',
        estimatedCompletionDate: new Date('2024-01-17'),
        completedAt: new Date('2024-01-17'),
        transactionHash: '0x1234...5678',
        createdAt: new Date('2024-01-15')
      },
      {
        id: 'redeem_2',
        userId: user.sub,
        assetId: '1',
        tokenAmount: 50,
        baseValue: 6290,
        penalty: 943.5,
        processingFee: 31.45,
        finalValue: 5315.05,
        isEarlyRedeem: true,
        status: 'processing',
        estimatedCompletionDate: new Date('2024-01-22'),
        completedAt: null,
        transactionHash: null,
        createdAt: new Date('2024-01-20')
      },
      {
        id: 'redeem_3',
        userId: user.sub,
        assetId: '3',
        tokenAmount: 25,
        baseValue: 1685,
        penalty: 0,
        processingFee: 8.43,
        finalValue: 1676.57,
        isEarlyRedeem: false,
        status: 'pending',
        estimatedCompletionDate: new Date('2024-01-25'),
        completedAt: null,
        transactionHash: null,
        createdAt: new Date('2024-01-22')
      }
    ];

    let filteredHistory = mockHistory;
    if (status) {
      filteredHistory = mockHistory.filter(r => r.status === status);
    }

    // 模拟资产信息
    const assets = [
      { id: '1', tokenSymbol: 'NYC-RWA', tokenName: '纽约房产代币' },
      { id: '2', tokenSymbol: 'LON-RWA', tokenName: '伦敦房产代币' },
      { id: '3', tokenSymbol: 'TKY-RWA', tokenName: '东京房产代币' }
    ];

    const historyWithAssets = filteredHistory.slice(0, limit).map(redemption => ({
      ...redemption,
      asset: assets.find(a => a.id === redemption.assetId)
    }));

    return createAuthResponse(200, '获取赎回历史成功', {
      total: filteredHistory.length,
      history: historyWithAssets
    });

  } catch (error) {
    console.error('Get redemption history error:', error);
    return createAuthResponse(500, '服务器内部错误');
  }
}
