import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';
import { getUserIdFromRequest } from '@/lib/auth';
import { ObjectId } from 'mongodb';

// PUT - Update expense
export async function PUT(request, { params }) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    const { amount, reason, date } = await request.json();

    if (!amount || !reason || !date) {
      return NextResponse.json(
        { error: 'Amount, reason, and date are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    
    // Check if expense exists and belongs to user
    const existingExpense = await db.collection('expenses').findOne({
      _id: new ObjectId(id),
      user_id: userId
    });

    if (!existingExpense) {
      return NextResponse.json(
        { error: 'Expense not found' },
        { status: 404 }
      );
    }

    // Update the expense
    await db.collection('expenses').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          amount: parseFloat(amount),
          reason,
          date,
          updated_at: new Date()
        }
      }
    );

    const updatedExpense = await db.collection('expenses').findOne({ _id: new ObjectId(id) });

    return NextResponse.json({
      message: 'Expense updated successfully',
      expense: updatedExpense
    });

  } catch (error) {
    console.error('Update expense error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete expense
export async function DELETE(request, { params }) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    const db = await getDatabase();
    
    // Check if expense exists and belongs to user
    const existingExpense = await db.collection('expenses').findOne({
      _id: new ObjectId(id),
      user_id: userId
    });

    if (!existingExpense) {
      return NextResponse.json(
        { error: 'Expense not found' },
        { status: 404 }
      );
    }

    // Delete the expense
    await db.collection('expenses').deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({
      message: 'Expense deleted successfully'
    });

  } catch (error) {
    console.error('Delete expense error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 