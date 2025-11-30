import { NextRequest, NextResponse } from 'next/server';
import { getCollection, User, Product } from '@/lib/db';
import { ObjectId } from 'mongodb';

// GET artisan profile by studio name (slug)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const usersCollection = await getCollection<User>('users');

    // Try to find by studio name first, then by name
    const user = await usersCollection.findOne({
      role: 'artisan',
      $or: [
        { 'artisanProfile.studioName': decodedSlug },
        { name: decodedSlug },
      ],
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Artisan profile not found' },
        { status: 404 }
      );
    }

    // Get artisan's products
    const productsCollection = await getCollection<Product>('products');
    const artisanId = user._id?.toString() || '';
    const products = await productsCollection
      .find({ artisanId, status: 'published' })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      profile: {
        id: user._id?.toString(),
        name: user.name,
        email: user.email,
        artisanProfile: user.artisanProfile,
        createdAt: user.createdAt,
      },
      products,
    });
  } catch (error) {
    console.error('Get artisan profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

