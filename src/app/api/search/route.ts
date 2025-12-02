import { NextRequest, NextResponse } from 'next/server';
import { getCollection, Product } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const artisan = searchParams.get('artisan');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    const productsCollection = await getCollection<Product>('products');

    const query: Record<string, unknown> = { status: 'published' };

    if (category) {
      query.category = category;
    }

    if (artisan) {
      query.artisan = { $regex: artisan, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) {
        (query.price as Record<string, number>).$gte = Number(minPrice);
      }
      if (maxPrice) {
        (query.price as Record<string, number>).$lte = Number(maxPrice);
      }
    }

    if (search) {
      query.$text = { $search: search };
    }

    const productsCursor = productsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    const [products, categories] = await Promise.all([
      productsCursor.toArray(),
      productsCollection.distinct('category', { status: 'published' }),
    ]);

    return NextResponse.json({
      products,
      filters: {
        categories,
      },
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { getCollection, Product } from '@/lib/db';

// GET search products with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const artisan = searchParams.get('artisan');

    const productsCollection = await getCollection<Product>('products');
    let query: any = {
      status: 'published',
    };

    // Search in name, description, artisan name
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { artisan: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (artisan) {
      query.artisan = { $regex: artisan, $options: 'i' };
    }

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
      }
    }

    const products = await productsCollection.find(query).sort({ createdAt: -1 }).toArray();

    // Get unique categories for filter options
    const allProducts = await productsCollection.find({ status: 'published' }).toArray();
    const categories = Array.from(
      new Set(allProducts.map((p) => p.category))
    ).sort();

    return NextResponse.json({
      products,
      filters: {
        categories,
        count: products.length,
      },
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

