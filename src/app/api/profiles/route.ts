import { NextRequest, NextResponse } from 'next/server';
import { getCollection, User } from '@/lib/db';

// GET all profiles (with optional role filter)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

    const usersCollection = await getCollection<User>('users');
    let query: any = {};

    if (role) {
      query.role = role;
    }

    const users = await usersCollection.find(query).toArray();

    // Remove sensitive data
    const sanitizedUsers = users.map((user) => ({
      _id: user._id?.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      artisanProfile: user.artisanProfile,
      createdAt: user.createdAt,
    }));

    return NextResponse.json({ users: sanitizedUsers });
  } catch (error) {
    console.error('Get profiles error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

