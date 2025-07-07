import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const result = await db.collection('users').insertOne({
      name,
      email,
      password: hashedPassword,
      created_at: new Date()
    });

    const token = generateToken(result.insertedId.toString());

    return NextResponse.json({
      message: 'User registered successfully',
      token,
      user: { id: result.insertedId.toString(), name, email }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 