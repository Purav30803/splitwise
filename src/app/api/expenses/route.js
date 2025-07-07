import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';
import { getUserIdFromRequest } from '@/lib/auth';

// GET expenses
export async function GET(request) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    const db = await getDatabase();
    
    let query = { user_id: userId };

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      query.date = {
        $gte: startDate.toISOString().split('T')[0],
        $lte: endDate.toISOString().split('T')[0]
      };
    }

    const expenses = await db.collection('expenses')
      .find(query)
      .sort({ date: -1, created_at: -1 })
      .toArray();

    return NextResponse.json({ expenses });

  } catch (error) {
    console.error('Get expenses error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST new expense
export async function POST(request) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { amount, reason, date } = await request.json();

    if (!amount || !reason || !date) {
      return NextResponse.json(
        { error: 'Amount, reason, and date are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    
    const result = await db.collection('expenses').insertOne({
      user_id: userId,
      amount: parseFloat(amount),
      reason,
      date,
      created_at: new Date()
    });

    const newExpense = await db.collection('expenses').findOne({ _id: result.insertedId });

    return NextResponse.json({
      message: 'Expense added successfully',
      expense: newExpense
    });

  } catch (error) {
    console.error('Add expense error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 