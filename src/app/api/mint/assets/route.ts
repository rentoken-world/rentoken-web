import { NextRequest } from 'next/server';
import { createAuthResponse } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // 模拟房产资产数据
    const assets = [
      {
        id: '1',
        name: '曼哈顿豪华公寓A座',
        location: '纽约, 美国',
        estimatedValue: 850000,
        monthlyRent: 4500,
        yieldRate: 6.35,
        tokenRatio: 1000, // 1 USD = 1000 tokens
        totalSupply: 850000000,
        circulatingSupply: 680000000,
        availableForStaking: 170000000,
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00',
        description: '位于曼哈顿核心区域的豪华公寓，交通便利，租赁需求旺盛。',
        documents: ['产权证明', '评估报告', '租赁合同'],
        status: 'active'
      },
      {
        id: '2',
        name: '伦敦市中心办公楼',
        location: '伦敦, 英国',
        estimatedValue: 1200000,
        monthlyRent: 8200,
        yieldRate: 8.2,
        tokenRatio: 800,
        totalSupply: 960000000,
        circulatingSupply: 960000000,
        availableForStaking: 0,
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
        description: '伦敦金融区核心办公楼，租户为知名金融机构，收益稳定。',
        documents: ['产权证明', '评估报告', '租赁合同'],
        status: 'sold_out'
      },
      {
        id: '3',
        name: '东京涩谷商业综合体',
        location: '东京, 日本',
        estimatedValue: 2100000,
        monthlyRent: 12000,
        yieldRate: 6.85,
        tokenRatio: 1200,
        totalSupply: 2520000000,
        circulatingSupply: 1680000000,
        availableForStaking: 840000000,
        image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc',
        description: '涩谷核心商圈的现代化商业综合体，包含零售、办公多种业态。',
        documents: ['产权证明', '评估报告', '租赁合同'],
        status: 'active'
      }
    ];

    const activeAssets = assets.filter(asset => asset.status === 'active');

    return createAuthResponse(200, '获取可质押资产成功', {
      assets: activeAssets
    });

  } catch (error) {
    console.error('Get stakeable assets error:', error);
    return createAuthResponse(500, '服务器内部错误');
  }
}
