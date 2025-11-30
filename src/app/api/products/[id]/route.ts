import { NextRequest, NextResponse } from 'next/server';
import { getCollection, Product } from '@/lib/db';
import { requireAuth } from '@/lib/middleware';
import { ObjectId } from 'mongodb';

// GET single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productsCollection = await getCollection<Product>('products');

    const product = await productsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update product (artisan only, must own the product)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth(request, ['artisan']);

    if (session instanceof NextResponse) {
      return session; // Error response
    }

    const { id } = await params;
    const { name, price, category, description, image, status } = await request.json();

    const productsCollection = await getCollection<Product>('products');

    // Check if product exists and user owns it
    const product = await productsCollection.findOne({
      _id: new ObjectId(id),
      artisanId: session.userId,
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found or you do not have permission to edit it' },
        { status: 404 }
      );
    }

    const updateData: Partial<Product> = {
      updatedAt: new Date(),
    };

    if (name) updateData.name = name;
    if (price !== undefined) updateData.price = Number(price);
    if (category) updateData.category = category;
    if (description) updateData.description = description;
    if (image) updateData.image = image;
    if (status) updateData.status = status === 'published' ? 'published' : 'draft';

    await productsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    const updatedProduct = await productsCollection.findOne({
      _id: new ObjectId(id),
    });

    return NextResponse.json({
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE product (artisan only, must own the product)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth(request, ['artisan']);

    if (session instanceof NextResponse) {
      return session; // Error response
    }

    const { id } = await params;
    const productsCollection = await getCollection<Product>('products');

    // Check if product exists and user owns it
    const product = await productsCollection.findOne({
      _id: new ObjectId(id),
      artisanId: session.userId,
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found or you do not have permission to delete it' },
        { status: 404 }
      );
    }

    await productsCollection.deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

