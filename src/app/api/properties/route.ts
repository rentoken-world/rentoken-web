/*
 * @Author: dreamworks.cnn@gmail.com
 * @Date: 2025-08-20 17:26:56
 * @LastEditors: dreamworks.cnn@gmail.com
 * @LastEditTime: 2025-08-23 00:31:42
 * @FilePath: /rentoken-web/src/app/api/properties/route.ts
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database-service';
import { mock_properties } from '@/mockData/data'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';
    const owner = searchParams.get('owner') || '';
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;



    // return  NextResponse.json({
    //   success: true,
    //   data: mock_properties,
    // }) 
    const result = await db.getProperties({
      page,
      limit,
      search,
      category,
      status,
      owner,
      minPrice,
      maxPrice,
    });
    console.log('GET:result:', result)
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { title, description, price, tokenSupply, location, expectedYield, category, owner } = body;
    
    if (!title || !description || !price || !tokenSupply || !location || !expectedYield || !category || !owner) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }



    // Create property
    const property = await db.createProperty({
      title,
      description,
      price: parseFloat(price),
      tokenSupply: parseInt(tokenSupply),
      location,
      expectedYield: parseFloat(expectedYield),
      category,
      owner,
    });

    return NextResponse.json({
      success: true,
      data: property,
    });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create property' },
      { status: 500 }
    );
  }
}
