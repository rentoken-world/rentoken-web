import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database-service';

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
