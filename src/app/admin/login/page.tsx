'use client';

import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Toast from '../../../components/Toast'; // Adjust path if necessary

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setToast(null); // Clear previous toasts
    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', { username, password });
      localStorage.setItem('adminToken', res.data.token);
      console.log('Admin Token saved to localStorage:', res.data.token);
      setToast({ message: 'Admin login successful! Redirecting...', type: 'success' });
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 1500); // Redirect after a short delay to show toast
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setToast({ message: err.response.data.message || 'Login failed', type: 'error' });
      } else {
        setToast({ message: 'An unexpected error occurred', type: 'error' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-amber-50 py-16 px-4 ">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="max-w-md mx-auto dark:bg-black ">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group">
            <span className="text-4xl font-bold font-display bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent group-hover:from-amber-600 group-hover:to-orange-500 transition-all duration-300">☀️ Sunshine Admin</span>
          </Link>
          <h1 className="mt-6 text-2xl font-display font-bold text-gray-900">Admin Login</h1>
          <p className="mt-2 text-sm text-gray-600">Please sign in to your admin account</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-amber-100/20 dark:bg-black">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                placeholder="Enter your password"
              />
            </div>

            {/* Error message replaced by Toast */}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-orange-600 text-white py-3 rounded-xl font-medium hover:bg-orange-700 transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Sign in as Admin'
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
