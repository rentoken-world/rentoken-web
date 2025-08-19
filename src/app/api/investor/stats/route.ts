import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database-service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json(
        { success: false, error: 'Address parameter is required' },
        { status: 400 }
      );
    }

    const stats = await db.getInvestorStats(address);

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching investor stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch investor stats' },
      { status: 500 }
    );
  }
}
