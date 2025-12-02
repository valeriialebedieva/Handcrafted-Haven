import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getCollection, Product, Review, User } from '@/lib/db';
import { requireAuth } from '@/lib/middleware';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const limit = Number(searchParams.get('limit') || '20');

    const reviewsCollection = await getCollection<Review>('reviews');

    const query: Record<string, unknown> = {};
    if (productId) {
      query.productId = productId;
    }

    const reviews = await reviewsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Fetch reviews error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth(request, ['customer']);
    if (session instanceof NextResponse) {
      return session;
    }

    const { productId, rating, comment } = await request.json();

    if (!productId || !rating || !comment) {
      return NextResponse.json(
        { error: 'Product, rating, and comment are required' },
        { status: 400 },
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 },
      );
    }

    const productsCollection = await getCollection<Product>('products');
    const product = await productsCollection.findOne({
      _id: new ObjectId(productId),
    });

    if (!product || product.status !== 'published') {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 },
      );
    }

    const usersCollection = await getCollection<User>('users');
    const user = await usersCollection.findOne({
      _id: new ObjectId(session.userId),
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 },
      );
    }

    const reviewsCollection = await getCollection<Review>('reviews');
    const now = new Date();

    const review: Review = {
      productId,
      productName: product.name,
      userId: session.userId,
      reviewer: user.name,
      rating: Number(rating),
      comment,
      createdAt: now,
      updatedAt: now,
    };

    const result = await reviewsCollection.insertOne(review);

    return NextResponse.json(
      {
        message: 'Review submitted',
        review: { ...review, _id: result.insertedId.toString() },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { getCollection, Review } from '@/lib/db';
import { requireAuth } from '@/lib/middleware';
import { ObjectId } from 'mongodb';

// GET all reviews (with optional productId filter)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const userId = searchParams.get('userId');

    const reviewsCollection = await getCollection<Review>('reviews');
    let query: any = {};

    if (productId) {
      query.productId = productId;
    }

    if (userId) {
      query.userId = userId;
    }

    const reviews = await reviewsCollection.find(query).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Get reviews error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create new review (authenticated users only)
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth(request);

    if (session instanceof NextResponse) {
      return session; // Error response
    }

    const { productId, productName, rating, comment } = await request.json();

    // Validation
    if (!productId || !productName || !rating || !comment) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Get user name
    const { getCollection, User } = await import('@/lib/db');
    const usersCollection = await getCollection<User>('users');
    const user = await usersCollection.findOne({
      _id: new ObjectId(session.userId),
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const reviewsCollection = await getCollection<Review>();
    const now = new Date();

    // Check if user already reviewed this product
    const existingReview = await reviewsCollection.findOne({
      productId,
      userId: session.userId,
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 409 }
      );
    }

    const newReview: Review = {
      productId,
      productName,
      userId: session.userId,
      reviewer: user.name,
      rating: Number(rating),
      comment,
      createdAt: now,
      updatedAt: now,
    };

    const result = await reviewsCollection.insertOne(newReview);

    return NextResponse.json(
      {
        message: 'Review created successfully',
        review: {
          id: result.insertedId.toString(),
          ...newReview,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

