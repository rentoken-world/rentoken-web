import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database-service';

// 获取投资列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const investorAddress = searchParams.get('investorAddress') || '';
    const propertyId = searchParams.get('propertyId') || '';
    const status = searchParams.get('status') || '';
    const sortBy = searchParams.get('sortBy') as 'date' | 'amount' | 'tokens' || 'date';
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' || 'desc';

    const result = await db.getInvestments({
      page,
      limit,
      investorAddress: investorAddress || undefined,
      propertyId: propertyId || undefined,
      status: status || undefined,
      sortBy,
      sortOrder,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching investments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch investments' },
      { status: 500 }
    );
  }
}

// 创建投资
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { propertyId, investorAddress, tokenAmount, investmentAmount } = body;
    
    if (!propertyId || !investorAddress || !tokenAmount || !investmentAmount) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create investment
    const investment = await db.createInvestment({
      propertyId,
      investorAddress,
      tokenAmount: parseInt(tokenAmount),
      investmentAmount: parseFloat(investmentAmount),
    });

    if (!investment) {
      return NextResponse.json(
        { success: false, error: 'Investment failed - property not found or insufficient tokens' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: investment,
    });
  } catch (error) {
    console.error('Error creating investment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create investment' },
      { status: 500 }
    );
  }
}
