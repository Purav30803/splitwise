'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { DollarSign, Calendar, FileText, Plus, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

export default function AddExpenseForm({ onExpenseAdded }) {
  const [formData, setFormData] = useState({
    amount: '',
    reason: '',
    date: format(new Date(), 'yyyy-MM-dd')
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add expense');
      }

      setSuccess(true);
      setTimeout(() => {
        setFormData({
          amount: '',
          reason: '',
          date: format(new Date(), 'yyyy-MM-dd')
        });
        setSuccess(false);
        if (onExpenseAdded) onExpenseAdded(data.expense);
      }, 1000);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="border border-gray-200 rounded-2xl p-6 bg-white">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Add New Expense</h3>

      {success && (
        <div className="mb-4 border border-gray-300 rounded-lg p-4 bg-gray-50 text-sm flex items-start space-x-3">
          <CheckCircle className="text-gray-600 w-5 h-5 mt-0.5" />
          <div>
            <p className="font-medium text-gray-800">Expense added successfully.</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 border border-gray-300 rounded-lg p-4 bg-gray-50 text-sm flex items-start space-x-3">
          <AlertCircle className="text-gray-600 w-5 h-5 mt-0.5" />
          <div>
            <p className="font-medium text-gray-800">Something went wrong.</p>
            <p className="text-gray-500">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount */}
        <div className="space-y-2">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400 text-base">
              ₹
            </div>
            <input
              type="number"
              name="amount"
              id="amount"
              required
              step="0.01"
              min="0"
              placeholder="0.00"
              className="w-full pl-7 pr-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400"
              value={formData.amount}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Reason */}
        <div className="space-y-2">
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Description</label>
          <input
            type="text"
            name="reason"
            id="reason"
            required
            placeholder="What was this expense for?"
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400"
            value={formData.reason}
            onChange={handleChange}
          />
        </div>

        {/* Date */}
        <div className="space-y-2">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            name="date"
            id="date"
            required
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400"
            value={formData.date}
            onChange={handleChange}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || success}
          className="w-full flex justify-center items-center space-x-2 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Adding...</span>
            </>
          ) : success ? (
            <>
              <CheckCircle className="h-4 w-4" />
              <span>Added</span>
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              <span>Add Expense</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
