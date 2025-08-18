import { NextRequest } from 'next/server';
import { createAuthResponse } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // 模拟代币数据
    const tokens = [
      { id: 'eth', symbol: 'ETH', name: 'Ethereum', price: 2340.50, icon: '🔷' },
      { id: 'usdc', symbol: 'USDC', name: 'USD Coin', price: 1.00, icon: '💵' },
      { id: 'rwa-nyc', symbol: 'NYC-RWA', name: '纽约房产代币', price: 125.80, icon: '🏢' },
      { id: 'rwa-london', symbol: 'LON-RWA', name: '伦敦房产代币', price: 89.25, icon: '🏛️' },
      { id: 'rwa-tokyo', symbol: 'TKY-RWA', name: '东京房产代币', price: 67.40, icon: '🏯' }
    ];

    // 模拟流动性池数据
    const pools = [
      {
        id: 'pool_eth_usdc',
        token0: tokens.find(t => t.id === 'eth'),
        token1: tokens.find(t => t.id === 'usdc'),
        liquidity: 1250000,
        volume24h: 89000,
        fees24h: 267,
        apr: 15.6,
        totalSupply: 1000000,
        reserve0: 534.2,
        reserve1: 1250000
      },
      {
        id: 'pool_nyc_usdc',
        token0: tokens.find(t => t.id === 'rwa-nyc'),
        token1: tokens.find(t => t.id === 'usdc'),
        liquidity: 850000,
        volume24h: 34000,
        fees24h: 102,
        apr: 22.3,
        totalSupply: 750000,
        reserve0: 6758.9,
        reserve1: 850000
      },
      {
        id: 'pool_london_eth',
        token0: tokens.find(t => t.id === 'rwa-london'),
        token1: tokens.find(t => t.id === 'eth'),
        liquidity: 420000,
        volume24h: 18000,
        fees24h: 54,
        apr: 18.9,
        totalSupply: 500000,
        reserve0: 4707.8,
        reserve1: 179.4
      }
    ];

    return createAuthResponse(200, '获取流动性池成功', {
      pools
    });

  } catch (error) {
    console.error('Get pools error:', error);
    return createAuthResponse(500, '服务器内部错误');
  }
}
