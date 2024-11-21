import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import Product from '@/models/Product';

export async function GET() {
  try {
    await dbConnect();

    // Get total orders and sales
    const orders = await Order.find({});
    const totalOrders = orders.length;
    const totalSales = orders.reduce((acc, order) => acc + order.total, 0);

    // Get total customers
    const totalCustomers = await User.countDocuments({ role: 'user' });

    // Get total products
    const totalProducts = await Product.countDocuments();

    return NextResponse.json({
      totalOrders,
      totalSales,
      totalCustomers,
      totalProducts
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}