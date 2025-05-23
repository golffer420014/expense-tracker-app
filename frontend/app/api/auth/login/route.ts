import { NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';
import { verify } from 'argon2';
import Schema from '@/lib/db';

const userSchema = new Schema('users');

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const result = await userSchema.findOne(`WHERE username = '${username}'`);


    if (!result || !result.password_hash) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isValidPassword = await verify(result.password_hash, password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = sign(
      { userId: result.id },
      process.env.NEXT_PUBLIC_JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 