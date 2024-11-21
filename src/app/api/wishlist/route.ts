import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Wishlist from '@/models/Wishlist';

interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  image: string;
}

export async function GET(req: Request) {
  try {
    await dbConnect();
    const userId = req.headers.get('user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const wishlist = await Wishlist.findOne({ userId });
    return NextResponse.json({ items: wishlist?.items || [] });
  } catch (error) {
    console.error('GET Wishlist error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    console.log('Received wishlist data:', body); // Debug log

    const { userId, productId, name, price, image } = body;

    if (!userId || !productId || !name || price === undefined || !image) {
      return NextResponse.json({ 
        error: 'Missing required fields',
        received: { userId, productId, name, price, image } 
      }, { status: 400 });
    }

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ 
        userId, 
        items: [] 
      });
    }

    // Check if item already exists
    const itemExists = wishlist.items.some(
      (item: WishlistItem) => item.productId === productId
    );

    if (!itemExists) {
      const newItem = {
        productId,
        name,
        price: typeof price === 'string' ? parseFloat(price.replace('£', '')) : price,
        image
      };
      console.log('Adding new item:', newItem); // Debug log
      wishlist.items.push(newItem);
      await wishlist.save();
    }

    return NextResponse.json({ success: true, wishlist });
  } catch (error: Error) {
    console.error('POST Wishlist error:', {
      message: error.message,
      errors: error.errors,
      stack: error.stack
    });
    return NextResponse.json({ 
      error: 'Server error', 
      details: error.message 
    }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { userId, productId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const wishlist = await Wishlist.findOne({ userId });
    
    if (wishlist) {
      wishlist.items = wishlist.items.filter(
        (item: WishlistItem) => item.productId !== productId
      );
      await wishlist.save();
    }

    return NextResponse.json({ success: true, wishlist });
  } catch (error) {
    console.error('DELETE Wishlist error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}