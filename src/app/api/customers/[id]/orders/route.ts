import { NextRequest, NextResponse } from 'next/server';
import { getCollection, Order } from '@/lib/db';
import { requireAuth } from '@/lib/middleware';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth(request);

    if (session instanceof NextResponse) {
      return session;
    }

    const { id } = await params;

    // Users can only view their own orders
    if (session.userId !== id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const ordersCollection = await getCollection<Order>('orders');
    const orders = await ordersCollection
      .find({ userId: id })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

