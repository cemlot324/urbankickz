import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET() {
  console.log('API route hit');
  
  try {
    await dbConnect();
    console.log('Database connected');

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(3);

    console.log('Orders found:', recentOrders);

    return NextResponse.json(recentOrders);
  } catch (error) {
    console.error('Error in recent orders API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent orders' },
      { status: 500 }
    );
  }
}