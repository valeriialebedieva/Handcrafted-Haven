// MongoDB connection and database utilities
import { MongoClient, Db, Collection } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/handcrafted-haven';
const dbName = process.env.MONGODB_DB || 'handcrafted-haven';

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
  if (db) {
    return db;
  }

  try {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    console.log('Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
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
    console.log('MongoDB connection closed');
  }
}

// Database models/schemas (TypeScript interfaces)
export interface User {
  _id?: string;
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
  _id?: string;
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
  _id?: string;
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

