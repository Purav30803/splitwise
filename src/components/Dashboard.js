'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ExpenseList from './ExpenseList';
import MonthlySummary from './MonthlySummary';
import { LogOut, User, Sparkles, LayoutGrid, ListOrdered, BarChart3 } from 'lucide-react';
import { Home } from 'lucide-react';
import Image from 'next/image';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('expenses');
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* App Shell */}
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] min-h-screen">
        {/* Sidebar */}
        <aside className="hidden lg:flex lg:flex-col border-r border-gray-200 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="h-16 flex items-center px-5 border-b border-gray-200/60">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center">
                <Image src="/logo.png" alt="Splitwise" width={36} height={36} />
              </div>
              <span className="text-lg font-semibold tracking-tight text-gray-900">Splitwise</span>
            </div>
          </div>

          <nav className="p-3 space-y-4">
            <button
              onClick={() => setActiveTab('expenses')}
              className={`w-full flex items-center space-x-3 px-3 py-4 rounded-lg text-sm transition-colors cursor-pointer
                ${activeTab === 'expenses' ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <ListOrdered className="w-4 h-4" />
              <span>Expenses</span>
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`w-full flex items-center space-x-3 px-3 py-4 rounded-lg text-sm transition-colors cursor-pointer
                ${activeTab === 'summary' ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Monthly Summary</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center space-x-3 px-3 py-4 rounded-lg text-sm transition-colors cursor-pointer
                ${activeTab === 'profile' ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </button>
          </nav>
          <div className="mt-auto p-4 border-t border-gray-200/60">
           
            <button
              onClick={handleLogout}
              className="w-full inline-flex items-center justify-center space-x-2 bg-red-500 text-white px-4 py-2.5 rounded-md text-sm hover:bg-red-800 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>

         
        </aside>

        {/* Main column */}
        <div className="flex flex-col min-h-screen">
          {/* Topbar (mobile + desktop) */}
          <header className="sticky top-0 z-30 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200 sm:hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="h-16 flex items-center justify-between">
                <div className="flex items-center space-x-3 lg:hidden">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center">
                    <Image src="/logo.png" alt="Splitwise" width={36} height={36} />
                  </div>
                  <span className="text-base font-semibold tracking-tight text-gray-900">Splitwise</span>
                </div>

                {/* Mobile tabs moved to bottom nav */}

                {/* Desktop right actions */}
                {/* <div className="hidden lg:flex items-center space-x-3">
                  <div className="hidden md:flex items-center space-x-3 bg-gray-100 rounded-full px-3 py-1.5">
                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-gray-600" />
                    </div>
                    <span className="text-xs font-medium text-gray-700 max-w-[160px] truncate">{user?.name || 'User'}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 bg-gray-900 text-white px-3 py-1.5 rounded-md text-sm hover:bg-black"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div> */}
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:py-8 lg:pb-8">
              {activeTab === 'expenses' && <ExpenseList />}
              {activeTab === 'summary' && <MonthlySummary />}
              {activeTab === 'profile' && (
                <div className="max-w-md mx-auto">
                  <div className="border border-gray-200 rounded-xl p-6 bg-white">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 text-lg font-semibold">
                        {(user?.name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-base font-semibold text-gray-900 truncate">{user?.name || 'User'}</p>
                        <p className="text-sm text-gray-600 truncate">{user?.email || ''}</p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <button
                        onClick={handleLogout}
                        className="w-full inline-flex items-center justify-center space-x-2 bg-gray-900 text-white px-4 py-2.5 rounded-md text-sm hover:bg-black"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>

          {/* Bottom navigation (mobile) */}
          <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-gray-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-3 h-16">
                <button
                  aria-label="Home"
                  onClick={() => setActiveTab('expenses')}
                  className={`flex flex-col items-center justify-center text-xs ${activeTab === 'expenses' ? 'text-gray-900' : 'text-gray-500'}`}
                >
                  <Home className="w-5 h-5 mb-1" />
                  <span>Home</span>
                </button>
                <button
                  aria-label="Summary"
                  onClick={() => setActiveTab('summary')}
                  className={`flex flex-col items-center justify-center text-xs ${activeTab === 'summary' ? 'text-gray-900' : 'text-gray-500'}`}
                >
                  <BarChart3 className="w-5 h-5 mb-1" />
                  <span>Summary</span>
                </button>
                <button
                  aria-label="Profile"
                  onClick={() => setActiveTab('profile')}
                  className={`flex flex-col items-center justify-center text-xs ${activeTab === 'profile' ? 'text-gray-900' : 'text-gray-500'}`}
                >
                  <User className="w-5 h-5 mb-1" />
                  <span>Profile</span>
                </button>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
} 