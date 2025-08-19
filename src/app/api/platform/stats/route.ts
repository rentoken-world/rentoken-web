import { NextResponse } from 'next/server';
import { db } from '@/lib/database-service';

export async function GET() {
  try {
    const stats = await db.getPlatformStats();

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching platform stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch platform stats' },
      { status: 500 }
    );
  }
}
