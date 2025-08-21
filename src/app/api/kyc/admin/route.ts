import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database-service';

// KYC状态管理接口（管理员用）
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, status, reason } = body;

    // 验证必填字段
    if (!walletAddress || !status) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: walletAddress, status' },
        { status: 400 }
      );
    }

    // 验证状态值
    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status. Must be "approved" or "rejected"' },
        { status: 400 }
      );
    }

    // 更新KYC状态
    const updatedKyc = await db.updateKycStatus(walletAddress, status, reason);

    if (!updatedKyc) {
      return NextResponse.json(
        { success: false, error: 'KYC record not found or could not be updated' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedKyc,
      message: `KYC status updated to ${status}`,
    });

  } catch (error) {
    console.error('Error updating KYC status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update KYC status' },
      { status: 500 }
    );
  }
}

// 获取所有KYC记录（管理员用）
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || '';

    // 这个方法需要在database-service中实现
    const kycRecords = await db.getAllKycRecords(status || undefined);

    return NextResponse.json({
      success: true,
      data: kycRecords,
    });
  } catch (error) {
    console.error('Error fetching KYC records:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch KYC records' },
      { status: 500 }
    );
  }
}
