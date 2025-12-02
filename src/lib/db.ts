// MongoDB connection and database utilities
import { MongoClient, Db, Collection, ObjectId } from 'mongodb';

const uri =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/handcrafted-haven';
const dbName = process.env.MONGODB_DB || 'handcrafted-haven';

const globalWithMongo = globalThis as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient>;
let db: Db | null = null;
let indexesInitialized = false;

if (!globalWithMongo._mongoClientPromise) {
  client = new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  });
  globalWithMongo._mongoClientPromise = client.connect();
}

clientPromise = globalWithMongo._mongoClientPromise;

export async function connectToDatabase(): Promise<Db> {
  if (db) {
    return db;
  }

  try {
    client = await clientPromise;
    db = client.db(dbName);
    await initializeIndexes(db);
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

async function initializeIndexes(database: Db) {
  if (indexesInitialized) {
    return;
  }

  await Promise.all([
    database.collection<Product>('products').createIndexes([
      { key: { category: 1 } },
      { key: { artisanId: 1 } },
      { key: { status: 1 } },
      { key: { name: 'text', description: 'text', artisan: 'text' } },
    ]),
    database.collection<Review>('reviews').createIndexes([
      { key: { productId: 1 } },
      { key: { userId: 1 } },
      { key: { createdAt: -1 } },
    ]),
    database.collection<User>('users').createIndexes([
      { key: { email: 1 }, unique: true },
      { key: { role: 1 } },
    ]),
  ]);

  indexesInitialized = true;
}

export async function getCollection<T>(collectionName: string): Promise<Collection<T>> {
  const database = await connectToDatabase();
  return database.collection<T>(collectionName);
}

export async function closeConnection(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
    globalWithMongo._mongoClientPromise = undefined;
  }
}

// Database models/schemas (TypeScript interfaces)
export interface User {
  _id?: ObjectId;
  email: string;
  password: string;
  name: string;
  role: 'artisan' | 'customer';
  createdAt: Date;
  updatedAt: Date;
  artisanProfile?: {
    studioName?: string;
    location?: string;
    specialty?: string;
    story?: string;
    tags?: string[];
  };
}

export interface Product {
  _id?: ObjectId;
  name: string;
  price: number;
  category: string;
  artisan: string;
  artisanId: string;
  description: string;
  image: string;
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
}

export interface Review {
  _id?: ObjectId;
  productId: string;
  productName: string;
  userId: string;
  reviewer: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  _id?: string;
  userId: string;
  products: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

