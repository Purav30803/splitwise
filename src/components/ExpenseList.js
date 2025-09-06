'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { format, parseISO } from 'date-fns';
import AddExpenseForm from './AddExpenseForm';
import EditExpenseForm from './EditExpenseForm';
import { Plus, X, Calendar, DollarSign, Receipt, Edit, Trash2 } from 'lucide-react';

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [deletingExpense, setDeletingExpense] = useState(null);
  const { token } = useAuth();

  const fetchExpenses = async () => {
    try {
      const response = await fetch('/api/expenses', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch expenses');
      setExpenses(data.expenses);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchExpenses();
  }, [token]);

  const handleExpenseAdded = (newExpense) => {
    setExpenses(prev => [newExpense, ...prev]);
    setShowAddForm(false);
  };

  const handleExpenseUpdated = (updatedExpense) => {
    setExpenses(prev => 
      prev.map(exp => exp._id === updatedExpense._id ? updatedExpense : exp)
    );
    setEditingExpense(null);
  };

  const handleExpenseDeleted = async (expenseId) => {
    try {
      const response = await fetch(`/api/expenses/${expenseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete expense');
      }

      setExpenses(prev => prev.filter(exp => exp._id !== expenseId));
      setDeletingExpense(null);
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const groupedExpenses = expenses.reduce((groups, expense) => {
    const date = expense.date;
    const monthKey = date.substring(0, 7);
    if (!groups[monthKey]) groups[monthKey] = {};
    if (!groups[monthKey][date]) groups[monthKey][date] = [];
    groups[monthKey][date].push(expense);
    return groups;
  }, {});
  const sortedMonths = Object.keys(groupedExpenses).sort((a, b) => new Date(b) - new Date(a));
  const totalExpenses = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-8 w-8 border-t border-gray-400 rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 border border-gray-300 rounded-xl max-w-xl mx-auto mt-10 text-center">
        <X className="mx-auto text-gray-500 mb-2" />
        <h2 className="font-semibold text-lg mb-1">Failed to load expenses</h2>
        <p className="text-sm text-gray-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div>
          {/* <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Expense Tracker</h1>
              <p className="text-gray-500 mt-1 text-sm">Minimal tracking. Maximum clarity.</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-xl font-semibold text-gray-900">${totalExpenses.toFixed(2)}</p>
            </div>
          </div> */}

          {/* Add Button */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-xl hover:bg-gray-50 transition"
            >
              {showAddForm ? (
                <span className="flex items-center text-black justify-center space-x-2">
                  <X size={16} />
                  <span className='text-black'>Cancel</span>
                </span>
              ) : (
                <span className="flex items-center text-black justify-center space-x-2">
                  <Plus size={16} />
                  <span>Add New Expense</span>
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Form */}
        {showAddForm && (
          <AddExpenseForm onExpenseAdded={handleExpenseAdded} />
        )}

        {/* Empty State */}
        {sortedMonths.length === 0 ? (
          <div className="text-center border border-gray-200 rounded-xl p-10">
            <div className="mb-4">
              <Receipt className="mx-auto text-gray-400 h-10 w-10" />
            </div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">No expenses yet</h2>
            <p className="text-sm text-gray-500 mb-4">Add your first expense to get started.</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 border border-gray-300 rounded-xl text-sm hover:bg-gray-50"
            >
              <Plus className="inline-block mr-1" size={14} />
              Add Expense
            </button>
          </div>
        ) : (
          sortedMonths.map(monthKey => {
            const monthDate = new Date(monthKey + '-02');
            const monthName = format(monthDate, 'MMMM yyyy');
            const monthExpenses = groupedExpenses[monthKey];
            const sortedDates = Object.keys(monthExpenses).sort((a, b) => new Date(b) - new Date(a));
            const monthTotal = Object.values(monthExpenses).flat().reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

            return (
              <div key={monthKey} className="space-y-4">
                {/* Month Header */}
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} className="text-gray-500" />
                    <h2 className="text-lg font-medium text-gray-900">{monthName}</h2>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <span>${monthTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Daily Entries */}
                {sortedDates.map(date => (
                  <div key={date} className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 flex justify-between items-center border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-800">
                        {format(parseISO(date), 'EEEE, MMMM d')}
                      </p>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <span>
                          ${monthExpenses[date].reduce((sum, e) => sum + parseFloat(e.amount), 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {monthExpenses[date].map(exp => (
                        <div key={exp._id} className="p-4 hover:bg-gray-50 transition flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{exp.reason}</p>
                            <p className="text-xs text-gray-500">
                              Added on {format(parseISO(exp.created_at), 'MMM d, yyyy')}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <p className="text-right text-base font-semibold text-gray-800">
                              ${parseFloat(exp.amount).toFixed(2)}
                            </p>
                            <button
                              onClick={() => setEditingExpense(exp)}
                              className="p-1 text-indigo-600 hover:bg-indigo-50 rounded"
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => setDeletingExpense(exp)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            );
          })
        )}
      </div>

      {/* Edit Modal */}
      {editingExpense && (
        <EditExpenseForm
          expense={editingExpense}
          onSave={handleExpenseUpdated}
          onCancel={() => setEditingExpense(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Expense</h3>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-sm text-gray-700">
                Are you sure you want to delete the expense {deletingExpense.reason} for ${parseFloat(deletingExpense.amount).toFixed(2)}?
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setDeletingExpense(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                onClick={() => handleExpenseDeleted(deletingExpense._id)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
