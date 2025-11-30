import { NextRequest, NextResponse } from 'next/server';
import { getCollection, User } from '@/lib/db';
import { hashPassword, createSession } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role } = await request.json();

    // Validation
    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (role !== 'artisan' && role !== 'customer') {
      return NextResponse.json(
        { error: 'Role must be either "artisan" or "customer"' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const usersCollection = await getCollection<User>('users');
    const existingUser = await usersCollection.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create new user
    const hashedPassword = await hashPassword(password);
    const now = new Date();

    const newUser: User = {
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      role,
      createdAt: now,
      updatedAt: now,
      ...(role === 'artisan' && {
        artisanProfile: {
          studioName: name,
          tags: [],
        },
      }),
    };

    const result = await usersCollection.insertOne(newUser);

    // Create session
    const userId = result.insertedId.toString();
    await createSession(userId, newUser.email, newUser.role);

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: {
          id: userId,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

