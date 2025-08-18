import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { createToken } from '@/lib/auth';

// 认证消息模板
const AUTH_MSG = process.env.AUTH_MSG || 'Authentication to Poseidon. Timestamp <timestamp>';

// 模拟用户数据库 - 在实际项目中应该连接真实数据库
const mockUsers = new Map([
  ['0xcc44277d1d6ec279cd81e23111b1701758a3f82f', {
    id: '1',
    address: '0xcc44277d1d6ec279cd81e23111b1701758a3f82f',
    name: 'Test User',
    email: 'test@example.com',
    planId: 'basic',
    status: 'ACTIVE'
  }]
]);

export async function POST(request: NextRequest) {
  try {
    const { secret, timestamp, wallet } = await request.json();

    // 验证时间戳（不能超过1分钟前）
    const aMinuteAgo = Date.now() - 60 * 1000;
    if (timestamp < aMinuteAgo) {
      return NextResponse.json(
        { error: 'timestamp too old' }, 
        { status: 400 }
      );
    }

    // 生成认证消息
    const message = AUTH_MSG.replace('<timestamp>', `${timestamp}`);

    // 验证签名
    let signer: string;
    try {
      signer = ethers.verifyMessage(message, secret);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid secret' }, 
        { status: 400 }
      );
    }

    // 验证钱包地址
    if (signer.toUpperCase() !== wallet.toUpperCase()) {
      return NextResponse.json(
        { error: 'Wallet and secret do not match' }, 
        { status: 401 }
      );
    }

    // 查找用户
    const user = mockUsers.get(wallet.toLowerCase());
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' }, 
        { status: 404 }
      );
    }

    if (user.status === 'BANNED') {
      return NextResponse.json(
        { error: 'User is banned' }, 
        { status: 401 }
      );
    }

    // 创建JWT token
    const token = createToken({
      userId: user.id,
      address: user.address,
      name: user.name,
      planId: user.planId,
      status: user.status,
    });

    return NextResponse.json(token);

  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
