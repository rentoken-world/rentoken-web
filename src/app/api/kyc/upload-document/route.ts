import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAuth, createAuthResponse } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return createAuthResponse(401, '未授权访问');
    }

    const body = await request.json();
    const { type, filename, fileData } = body;

    const kyc = await prisma.kyc.findUnique({
      where: { userId: user.sub }
    });

    if (!kyc) {
      return createAuthResponse(400, '请先创建KYC申请');
    }

    // 这里应该集成文件存储服务（如AWS S3、阿里云OSS等）
    // 暂时模拟文档上传逻辑
    const documentUrl = `https://storage.example.com/kyc/${user.sub}/${Date.now()}_${filename}`;

    const updatedDocuments = [
      ...(kyc.documents as any[]),
      {
        type,
        url: documentUrl,
        uploadedAt: new Date()
      }
    ];

    await prisma.kyc.update({
      where: { id: kyc.id },
      data: { documents: updatedDocuments }
    });

    return createAuthResponse(200, '文档上传成功', {
      documentUrl
    });

  } catch (error) {
    console.error('Document upload error:', error);
    return createAuthResponse(500, '服务器内部错误');
  }
}
