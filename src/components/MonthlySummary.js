'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { format, parseISO } from 'date-fns';
import { 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  BarChart3, 
  Award, 
  Clock, 
  X,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';

export default function MonthlySummary() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return {
      month: now.getMonth() + 1,
      year: now.getFullYear()
    };
  });
  const { token } = useAuth();

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/expenses/summary?month=${selectedMonth.month}&year=${selectedMonth.year}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch summary');
      }

      setSummary(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchSummary();
    }
  }, [token, selectedMonth]);

  const handleMonthChange = (e) => {
    const [year, month] = e.target.value.split('-');
    setSelectedMonth({ month: parseInt(month), year: parseInt(year) });
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(selectedMonth.year, selectedMonth.month - 1 + direction);
    setSelectedMonth({
      month: newDate.getMonth() + 1,
      year: newDate.getFullYear()
    });
  };

  const getMonthName = (month) => {
    const date = new Date(selectedMonth.year, month - 1);
    return date.toLocaleDateString('en-US', { month: 'long' });
  };

  const getAverageDaily = () => {
    if (!summary || summary.dailyBreakdown.length === 0) return 0;
    return summary.total / summary.dailyBreakdown.length;
  };

  const getHighestDay = () => {
    if (!summary || summary.dailyBreakdown.length === 0) return null;
    return summary.dailyBreakdown.reduce((max, day) => 
      parseFloat(day.total) > parseFloat(max.total) ? day : max
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col justify-center items-center py-16">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200"></div>
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent absolute top-0 left-0"></div>
            </div>
            <p className="mt-4 text-gray-500 text-sm">Loading monthly summary...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <X className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-red-800 font-medium">Error loading summary</p>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black p-4 sm:p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="border border-gray-200 rounded-xl p-6 sm:p-8 bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Monthly Summary</h1>
              <p className="text-sm text-gray-600 mt-1">Spending details for the selected month</p>
            </div>
            <div className="flex items-center space-x-3">
              <button onClick={() => navigateMonth(-1)} className="p-1.5 rounded hover:bg-gray-100">
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <input
                type="month"
                value={`${selectedMonth.year}-${selectedMonth.month.toString().padStart(2, '0')}`}
                onChange={handleMonthChange}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
              <button onClick={() => navigateMonth(1)} className="p-1.5 rounded hover:bg-gray-100">
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
  
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border border-gray-200 rounded-xl p-4 bg-white">
            <p className="text-sm text-gray-500">Total Expenses</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">₹{summary.total.toFixed(2)}</p>
            <p className="text-xs text-gray-400 mt-1">{getMonthName(selectedMonth.month)} {selectedMonth.year}</p>
          </div>
          <div className="border border-gray-200 rounded-xl p-4 bg-white">
            <p className="text-sm text-gray-500">Daily Average</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">₹{getAverageDaily().toFixed(2)}</p>
            <p className="text-xs text-gray-400 mt-1">{summary.dailyBreakdown.length} active days</p>
          </div>
          <div className="border border-gray-200 rounded-xl p-4 bg-white">
            <p className="text-sm text-gray-500">Highest Day</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">
              ₹{getHighestDay() ? parseFloat(getHighestDay().total).toFixed(2) : '0.00'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {getHighestDay() ? format(parseISO(getHighestDay().date), 'MMM d') : 'No data'}
            </p>
          </div>
          <div className="border border-gray-200 rounded-xl p-4 bg-white">
            <p className="text-sm text-gray-500">Active Days</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{summary.dailyBreakdown.length}</p>
            <p className="text-xs text-gray-400 mt-1">{summary.topExpenses.length} total expenses</p>
          </div>
        </div>
  
        {/* Daily Breakdown */}
        <div className="border border-gray-200 rounded-xl p-6 bg-white">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Breakdown</h3>
          {summary.dailyBreakdown.length === 0 ? (
            <div className="text-center text-sm text-gray-500">No expenses recorded for this month.</div>
          ) : (
            <div className="space-y-4">
              {summary.dailyBreakdown.map((day, i) => {
                const percentage = (parseFloat(day.total) / summary.total) * 100;
                return (
                  <div key={i}>
                    <div className="flex justify-between text-sm text-gray-800">
                      <span>{format(parseISO(day.date), 'MMM d, yyyy')}</span>
                      <span className="font-medium">₹{parseFloat(day.total).toFixed(2)}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded mt-1">
                      <div
                        className="h-2 bg-gray-800 rounded"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{percentage.toFixed(1)}% of monthly total</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
  
        {/* Top Expenses */}
        {summary.topExpenses.length > 0 && (
          <div className="border border-gray-200 rounded-xl p-6 bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Top Expenses</h3>
            <div className="space-y-4">
              {summary.topExpenses.map((expense, i) => (
                <div key={expense.id} className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{expense.reason}</p>
                    <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(parseISO(expense.date), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-semibold text-gray-900">
                      ₹{parseFloat(expense.amount).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {((parseFloat(expense.amount) / summary.total) * 100).toFixed(1)}% of total
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
}