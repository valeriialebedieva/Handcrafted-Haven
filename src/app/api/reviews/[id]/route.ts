import { NextRequest, NextResponse } from 'next/server';
import { getCollection, Review } from '@/lib/db';
import { requireAuth } from '@/lib/middleware';
import { ObjectId } from 'mongodb';

// GET single review
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const reviewsCollection = await getCollection<Review>('reviews');

    const review = await reviewsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ review });
  } catch (error) {
    console.error('Get review error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update review (user can only update their own)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth(request);

    if (session instanceof NextResponse) {
      return session;
    }

    const { id } = await params;
    const { rating, comment } = await request.json();

    const reviewsCollection = await getCollection<Review>('reviews');

    // Check if review exists and user owns it
    const review = await reviewsCollection.findOne({
      _id: new ObjectId(id),
      userId: session.userId,
    });

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found or you do not have permission to edit it' },
        { status: 404 }
      );
    }

    const updateData: Partial<Review> = {
      updatedAt: new Date(),
    };

    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return NextResponse.json(
          { error: 'Rating must be between 1 and 5' },
          { status: 400 }
        );
      }
      updateData.rating = Number(rating);
    }

    if (comment) {
      updateData.comment = comment;
    }

    await reviewsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    const updatedReview = await reviewsCollection.findOne({
      _id: new ObjectId(id),
    });

    return NextResponse.json({
      message: 'Review updated successfully',
      review: updatedReview,
    });
  } catch (error) {
    console.error('Update review error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE review (user can only delete their own)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth(request);

    if (session instanceof NextResponse) {
      return session;
    }

    const { id } = await params;
    const reviewsCollection = await getCollection<Review>('reviews');

    // Check if review exists and user owns it
    const review = await reviewsCollection.findOne({
      _id: new ObjectId(id),
      userId: session.userId,
    });

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found or you do not have permission to delete it' },
        { status: 404 }
      );
    }

    await reviewsCollection.deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

