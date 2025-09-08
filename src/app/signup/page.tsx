'use client';

import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Toast from '../../components/Toast';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setToast(null);

    if (!otpSent) {
      // This is the first step: send the OTP
      if (formData.password !== formData.confirmPassword) {
        setToast({ message: "Passwords don't match", type: 'error' });
        setIsLoading(false);
        return;
      }
      try {
        await axios.post('http://localhost:5000/api/auth/send-otp', { email: formData.email });
        setToast({ message: 'OTP sent successfully!', type: 'success' });
        setOtpSent(true);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          setToast({ message: error.response.data.message || 'An error occurred', type: 'error' });
        } else {
          setToast({ message: 'An unknown error occurred', type: 'error' });
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      // This is the second step: verify the OTP and register
      try {
        await axios.post('http://localhost:5000/api/auth/verify-otp', {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          otp
        });
        setToast({ message: 'Account created successfully! Redirecting to login...', type: 'success' });
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          setToast({ message: error.response.data.message || 'An error occurred', type: 'error' });
        } else {
          setToast({ message: 'An unknown error occurred', type: 'error' });
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-amber-50 py-16 px-4">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group">
            <span className="text-3xl font-bold font-display bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent group-hover:from-amber-600 group-hover:to-orange-500 transition-all duration-300">☀️ Sunshine</span>
          </Link>
          <h1 className="text-2xl font-bold font-display mt-6 mb-2">Create an Account</h1>
          <p className="text-gray-600">Join Sunshine for a brighter shopping experience</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              required
              minLength={8}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              required
              minLength={8}
            />
          </div>

          {otpSent && (
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">OTP</label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center"
          >
            {isLoading ? (otpSent ? 'Verifying...' : 'Sending OTP...') : (otpSent ? 'Verify & Register' : 'Create Account')}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-orange-600 hover:text-orange-700 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
