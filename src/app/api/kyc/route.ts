import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database-service';

// KYC状态查询接口
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const walletAddress = searchParams.get('address');

    if (!walletAddress) {
      return NextResponse.json(
        { success: false, error: 'Wallet address parameter is required' },
        { status: 400 }
      );
    }

    // 这里应该调用合约查询KYC状态
    // 目前先使用模拟数据
    const kycStatus = await db.getKycStatus(walletAddress);

    return NextResponse.json({
      success: true,
      data: kycStatus,
    });
  } catch (error) {
    console.error('Error fetching KYC status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch KYC status' },
      { status: 500 }
    );
  }
}

// KYC申请提交接口
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, email, fullName, documents } = body;

    // 验证必填字段
    if (!walletAddress || !email || !fullName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: walletAddress, email, fullName' },
        { status: 400 }
      );
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // 创建KYC申请记录
    const kycApplication = await db.createKycApplication({
      walletAddress,
      email,
      fullName,
      documents: documents || [],
      status: 'pending',
      submittedAt: new Date(),
    });

    // 生成邮件内容
    const emailSubject = `RWA Platform KYC Application - ${walletAddress}`;
    const emailBody = `
Dear KYC Team,

A new KYC application has been submitted:

- Wallet Address: ${walletAddress}
- Full Name: ${fullName}
- Email: ${email}
- Submitted At: ${new Date().toISOString()}

Documents: ${documents && documents.length > 0 ? documents.join(', ') : 'None provided'}

Please review this application and update the status accordingly.

Best regards,
RWA Platform System
    `.trim();

    // 创建邮箱链接 (mailto)
    const mailtoLink = `mailto:kyc@rwa-platform.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    return NextResponse.json({
      success: true,
      data: {
        application: kycApplication,
        mailtoLink,
        message: 'KYC application created successfully. Please send the email to complete your submission.',
      },
    });

  } catch (error) {
    console.error('Error creating KYC application:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create KYC application' },
      { status: 500 }
    );
  }
}
