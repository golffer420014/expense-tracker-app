import { NextResponse } from 'next/server';
import pool from '@/lib/pool';
import { verify } from 'jsonwebtoken';

// Middleware to verify JWT token
const verifyToken = (request: Request) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    throw new Error('No token provided');
  }

  const token = authHeader.split(' ')[1];
  const decoded = verify(token, process.env.JWT_SECRET || 'your-secret-key');
  return decoded;
};

export async function GET(request: Request) {
  try {
    const decoded = verifyToken(request);
    const { userId } = decoded as { userId: string };

    const result = await pool.query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC',
      [userId]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Get transactions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const decoded = verifyToken(request);
    const { userId } = decoded as { userId: string };
    const { amount, category_id, description, date } = await request.json();

    const result = await pool.query(
      'INSERT INTO transactions (user_id, amount, category_id, description, date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, amount, category_id, description, date]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Create transaction error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 