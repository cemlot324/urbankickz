import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function POST(request: Request) {
  console.log('1. API route hit'); // Debug log

  try {
    await dbConnect();
    console.log('2. Database connected'); // Debug log

    const data = await request.json();
    console.log('3. Received data:', data); // Debug log
    
    if (!data.userId) {
      console.log('4. No user ID provided'); // Debug log
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Generate unique order number
    const orderNumber = `UK${Date.now()}${Math.floor(Math.random() * 1000)}`;
    
    const orderData = {
      userId: data.userId,
      orderNumber,
      items: data.items,
      totalAmount: data.totalAmount,
      shippingDetails: data.shippingDetails,
      status: 'pending'
    };

    console.log('5. Creating order with data:', orderData); // Debug log

    const order = await Order.create(orderData);
    console.log('6. Order created:', order); // Debug log

    return NextResponse.json(order);
  } catch (error) {
    console.error('API Error:', error); // Debug log
    return NextResponse.json(
      { 
        error: 'Failed to create order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}