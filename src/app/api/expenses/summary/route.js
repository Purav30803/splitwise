import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';
import { getUserIdFromRequest } from '@/lib/auth';

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

    if (!month || !year) {
      return NextResponse.json(
        { error: 'Month and year are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const dateFilter = {
      $gte: startDate.toISOString().split('T')[0],
      $lte: endDate.toISOString().split('T')[0]
    };

    // Get total for the month
    const totalResult = await db.collection('expenses').aggregate([
      { $match: { user_id: userId, date: dateFilter } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]).toArray();

    const total = totalResult.length > 0 ? totalResult[0].total : 0;

    // Get daily breakdown
    const dailyBreakdown = await db.collection('expenses').aggregate([
      { $match: { user_id: userId, date: dateFilter } },
      { $group: { _id: '$date', total: { $sum: '$amount' } } },
      { $sort: { _id: -1 } }
    ]).toArray();

    // Get top expenses
    const topExpenses = await db.collection('expenses')
      .find({ user_id: userId, date: dateFilter })
      .sort({ amount: -1 })
      .limit(5)
      .toArray();

    return NextResponse.json({
      total,
      dailyBreakdown: dailyBreakdown.map(day => ({
        date: day._id,
        total: day.total
      })),
      topExpenses
    });

  } catch (error) {
    console.error('Summary error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 