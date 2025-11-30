import { NextRequest, NextResponse } from 'next/server';
import { getCollection, Product } from '@/lib/db';
import { requireAuth } from '@/lib/middleware';
import { ObjectId } from 'mongodb';

// GET all products (public, but can filter by artisan, category, etc.)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const artisanId = searchParams.get('artisanId');
    const category = searchParams.get('category');
    const status = searchParams.get('status') || 'published';
    const search = searchParams.get('search');

    const productsCollection = await getCollection<Product>('products');
    let query: any = {};

    if (artisanId) {
      query.artisanId = artisanId;
    }

    if (category) {
      query.category = category;
    }

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const products = await productsCollection.find(query).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create new product (artisan only)
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth(request, ['artisan']);

    if (session instanceof NextResponse) {
      return session; // Error response
    }

    const { name, price, category, description, image, status = 'draft' } = await request.json();

    // Validation
    if (!name || !price || !category || !description || !image) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Get user details for artisan info
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

    const productsCollection = await getCollection<Product>('products');
    const now = new Date();

    const newProduct: Product = {
      name,
      price: Number(price),
      category,
      artisan: user.artisanProfile?.studioName || user.name,
      artisanId: session.userId,
      description,
      image,
      status: status === 'published' ? 'published' : 'draft',
      createdAt: now,
      updatedAt: now,
    };

    const result = await productsCollection.insertOne(newProduct);

    return NextResponse.json(
      {
        message: 'Product created successfully',
        product: {
          id: result.insertedId.toString(),
          ...newProduct,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

