import { NextRequest, NextResponse } from 'next/server';
import { getCollection, User, Product } from '@/lib/db';
import { ObjectId } from 'mongodb';

// GET artisan profile with their products
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const usersCollection = await getCollection<User>('users');

    const user = await usersCollection.findOne({
      _id: new ObjectId(id),
      role: 'artisan',
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Artisan profile not found' },
        { status: 404 }
      );
    }

    // Get artisan's products
    const productsCollection = await getCollection<Product>('products');
    const products = await productsCollection
      .find({ artisanId: id, status: 'published' })
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
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update artisan profile (artisan only, must own the profile)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { requireAuth } = await import('@/lib/middleware');
    const session = await requireAuth(request, ['artisan']);

    if (session instanceof NextResponse) {
      return session; // Error response
    }

    const { id } = await params;

    if (session.userId !== id) {
      return NextResponse.json(
        { error: 'You can only update your own profile' },
        { status: 403 }
      );
    }

    const { studioName, location, specialty, story, tags } = await request.json();

    const usersCollection = await getCollection<User>('users');

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (studioName || location || specialty || story || tags) {
      updateData['artisanProfile'] = {};
      if (studioName) updateData['artisanProfile'].studioName = studioName;
      if (location) updateData['artisanProfile'].location = location;
      if (specialty) updateData['artisanProfile'].specialty = specialty;
      if (story) updateData['artisanProfile'].story = story;
      if (tags) updateData['artisanProfile'].tags = tags;
    }

    await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    const updatedUser = await usersCollection.findOne({
      _id: new ObjectId(id),
    });

    return NextResponse.json({
      message: 'Profile updated successfully',
      profile: {
        id: updatedUser?._id?.toString(),
        name: updatedUser?.name,
        email: updatedUser?.email,
        artisanProfile: updatedUser?.artisanProfile,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

