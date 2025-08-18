/*
 * @Author: dreamworks.cnn@gmail.com
 * @Date: 2025-08-18 00:12:57
 * @LastEditors: dreamworks.cnn@gmail.com
 * @LastEditTime: 2025-08-18 00:51:43
 * @FilePath: /auto_dex/frontend/src/app/api/kyc/submit/route.ts
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAuth, createAuthResponse } from '@/lib/auth';
import { z } from 'zod';

const createKycSchema = z.object({
  phone: z.string().regex(/^1[3-9]\d{9}$/, '请输入有效的手机号码'),
  email: z.string().email('请输入有效的邮箱地址'),
  idNumber: z.string().regex(/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, '请输入有效的身份证号码'),
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, '请输入有效的以太坊地址'),
  documents: z.array(z.object({
    type: z.string(),
    url: z.string(),
    uploadedAt: z.date()
  })).optional()
});

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return createAuthResponse(401, '未授权访问');
    }

    const body = await request.json();
    const validatedData = createKycSchema.parse(body);

    // 检查用户是否已经提交过KYC
    const existingKyc = await prisma.kyc.findUnique({
      where: { userId: user.sub }
    });

    if (existingKyc && existingKyc.status !== 'rejected') {
      return createAuthResponse(409, 'KYC申请已存在');
    }

    // 验证钱包地址是否已被其他用户绑定
    const existingWallet = await prisma.users.findFirst({
      where: { 
        address: validatedData.walletAddress,
        id: { not: user.sub }
      }
    });

    if (existingWallet) {
      return createAuthResponse(409, '钱包地址已被其他用户绑定');
    }

    // 创建或更新KYC记录
    const kycData = {
      userId: user.sub,
      phone: validatedData.phone,
      email: validatedData.email,
      idNumber: validatedData.idNumber,
      walletAddress: validatedData.walletAddress,
      status: 'pending',
      submittedAt: new Date(),
      documents: validatedData.documents || []
    };

    let kyc;
    if (existingKyc) {
      kyc = await prisma.kyc.update({
        where: { id: existingKyc.id },
        data: kycData
      });
    } else {
      kyc = await prisma.kyc.create({
        data: kycData
      });
    }

    // 更新用户钱包地址
    await prisma.users.update({
      where: { id: user.sub },
      data: { address: validatedData.walletAddress }
    });

    return createAuthResponse(200, 'KYC申请已提交', {
      kycId: kyc.id
    });

  } catch (error) {
    console.error('KYC submission error:', error);
    
    if (error instanceof z.ZodError) {
      return createAuthResponse(400, '数据验证失败', {
        errors: error
      });
    }
    
    return createAuthResponse(500, '服务器内部错误');
  }
}
