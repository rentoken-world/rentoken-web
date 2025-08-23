import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database-service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    

    const stats = await db.getInvestorStats();

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
