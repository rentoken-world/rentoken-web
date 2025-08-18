import { NextRequest } from 'next/server';
import { createAuthResponse } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // 模拟代币数据
    const tokens = [
      {
        id: 'eth',
        symbol: 'ETH',
        name: 'Ethereum',
        price: 2340.50,
        change24h: 2.45,
        volume24h: 1250000,
        marketCap: 280000000000,
        icon: '🔷',
        decimals: 18,
        isActive: true
      },
      {
        id: 'usdc',
        symbol: 'USDC',
        name: 'USD Coin',
        price: 1.00,
        change24h: 0.01,
        volume24h: 890000,
        marketCap: 32000000000,
        icon: '💵',
        decimals: 6,
        isActive: true
      },
      {
        id: 'rwa-nyc',
        symbol: 'NYC-RWA',
        name: '纽约房产代币',
        price: 125.80,
        change24h: 5.67,
        volume24h: 45000,
        marketCap: 85000000,
        icon: '🏢',
        decimals: 18,
        isActive: true
      },
      {
        id: 'rwa-london',
        symbol: 'LON-RWA',
        name: '伦敦房产代币',
        price: 89.25,
        change24h: -1.23,
        volume24h: 28000,
        marketCap: 62000000,
        icon: '🏛️',
        decimals: 18,
        isActive: true
      },
      {
        id: 'rwa-tokyo',
        symbol: 'TKY-RWA',
        name: '东京房产代币',
        price: 67.40,
        change24h: 3.89,
        volume24h: 67000,
        marketCap: 94000000,
        icon: '🏯',
        decimals: 18,
        isActive: true
      }
    ];

    const activeTokens = tokens.filter(token => token.isActive);

    return createAuthResponse(200, '获取代币列表成功', {
      tokens: activeTokens
    });

  } catch (error) {
    console.error('Get tokens error:', error);
    return createAuthResponse(500, '服务器内部错误');
  }
}
