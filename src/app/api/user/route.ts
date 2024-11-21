import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const firebaseId = searchParams.get('firebaseId');

    if (!firebaseId) {
      return NextResponse.json(
        { error: 'Firebase ID is required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ firebaseId });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ mongoUserId: user._id });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}