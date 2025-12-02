import { ObjectId } from 'mongodb';
import { connectToDatabase, Product, Review, User } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

async function seed() {
  const db = await connectToDatabase();
  const usersCollection = db.collection<User>('users');
  const productsCollection = db.collection<Product>('products');
  const reviewsCollection = db.collection<Review>('reviews');

  console.log('Clearing existing data...');
  await Promise.all([
    usersCollection.deleteMany({}),
    productsCollection.deleteMany({}),
    reviewsCollection.deleteMany({}),
  ]);

  console.log('Seeding users...');
  const now = new Date();

  const artisanId = new ObjectId();
  const customerId = new ObjectId();

  const users: User[] = [
    {
      _id: artisanId,
      name: 'Luna Atelier',
      email: 'artisan@example.com',
      password: await hashPassword('artisan123'),
      role: 'artisan',
      createdAt: now,
      updatedAt: now,
      artisanProfile: {
        studioName: 'Luna Atelier',
        location: 'Lisbon, Portugal',
        specialty: 'Sculptural brass jewelry',
        story:
          'Exploring soft geometric silhouettes inspired by ocean tides and moon cycles.',
        tags: ['Sustainable', 'Ships worldwide'],
      },
    },
    {
      _id: customerId,
      name: 'Aria Bloom',
      email: 'customer@example.com',
      password: await hashPassword('customer123'),
      role: 'customer',
      createdAt: now,
      updatedAt: now,
    },
  ];

  await usersCollection.insertMany(users);

  console.log('Seeding products...');
  const products: Product[] = [
    {
      name: 'Sunrise Coil Basket',
      price: 68,
      category: 'Textiles',
      artisan: 'Luna Atelier',
      artisanId: artisanId.toHexString(),
      description:
        'Hand-woven with maguey fibers and botanical dyes in warm clay tones.',
      image: '/window.svg',
      status: 'published',
      createdAt: now,
      updatedAt: now,
      tags: ['Small batch', 'Ready to ship'],
    },
    {
      name: 'Aurora Brass Earrings',
      price: 120,
      category: 'Jewelry',
      artisan: 'Luna Atelier',
      artisanId: artisanId.toHexString(),
      description:
        'Lightweight brass forms finished with a matte protective seal.',
      image: '/globe.svg',
      status: 'published',
      createdAt: now,
      updatedAt: now,
      tags: ['Made to order'],
    },
    {
      name: 'Terracotta Tea Set',
      price: 180,
      category: 'Ceramics',
      artisan: 'Luna Atelier',
      artisanId: artisanId.toHexString(),
      description: 'Wheel-thrown tea pot with two cups, glazed in soft beige.',
      image: '/file.svg',
      status: 'published',
      createdAt: now,
      updatedAt: now,
      tags: ['Limited run'],
    },
  ];

  const productInsertResult = await productsCollection.insertMany(products);
  const insertedProductIds = Object.values(productInsertResult.insertedIds).map(
    (id) => id.toString(),
  );

  console.log('Seeding reviews...');
  const reviews: Review[] = insertedProductIds.map((productId, index) => ({
    productId,
    productName: products[index].name,
    userId: customerId.toHexString(),
    reviewer: 'Aria Bloom',
    rating: 4 + (index % 2),
    comment:
      index % 2 === 0
        ? 'Beautiful craftsmanship and attention to detail.'
        : 'Gorgeous piece that feels even better in person.',
    createdAt: now,
    updatedAt: now,
  }));

  await reviewsCollection.insertMany(reviews);

  console.log('Database seeded successfully.');
  process.exit(0);
}

seed().catch((error) => {
  console.error('Error seeding database:', error);
  process.exit(1);
});

