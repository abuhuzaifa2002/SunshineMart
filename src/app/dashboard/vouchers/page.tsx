'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Toast from '../../../components/Toast';
import Image from 'next/image';

type Voucher = {
  _id: string;
  discountAmount: number;
  pointsCost: number;
};

type MyVoucher = {
  _id: string;
  code: string;
  createdAt: string;
  isRedeemed: boolean;
  showCode: boolean;
  voucher: Voucher;
};

export default function VouchersPage() {
  const [availableVouchers, setAvailableVouchers] = useState<Voucher[]>([]);
  const [myVouchers, setMyVouchers] = useState<MyVoucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    try {
      const availableRes = await axios.get('http://localhost:5000/api/vouchers', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAvailableVouchers(availableRes.data.vouchers);

      const myVouchersRes = await axios.get('http://localhost:5000/api/vouchers/my-vouchers', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyVouchers(myVouchersRes.data.myVouchers.map((v: MyVoucher) => ({ ...v, showCode: false }))); // Add showCode state

    } catch (err) {
      console.error('Error fetching vouchers:', err);
      setError('Failed to fetch vouchers.');
      setShowToast({ message: 'Failed to fetch vouchers.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseVoucher = async (voucherId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/vouchers/purchase', 
        { voucherId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowToast({ message: res.data.message || 'Voucher purchased successfully!', type: 'success' });
      fetchVouchers(); // Refresh lists
    } catch (err) {
      console.error('Error purchasing voucher:', err);
      const errorMessage =
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as any).response?.data?.message === 'string'
          ? (err as any).response.data.message
          : 'Failed to purchase voucher.';
      setShowToast({ message: errorMessage, type: 'error' });
    }
  };

  const toggleCodeVisibility = (id: string) => {
    setMyVouchers(myVouchers.map(v => 
      v._id === id ? { ...v, showCode: !v.showCode } : v
    ));
  };

  if (loading) return <div className="text-center py-8">Loading vouchers...</div>;
  if (error) return <div className="text-center py-8 text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Vouchers</h1>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Available Vouchers</h2>
          {availableVouchers.length === 0 ? (
            <p className="text-gray-600">No vouchers currently available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableVouchers.map((voucher) => (
                <div key={voucher._id} className="relative bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300">
                  <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: 'url(/assets/voucher.jpg)' }}></div>
                  <div className="p-6 relative z-10">
                    <h3 className="text-3xl font-extrabold mb-2">৳{voucher.discountAmount} OFF</h3>
                    <p className="text-sm mb-4">on your next purchase</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold">Cost: {voucher.pointsCost} Points</span>
                      <span className="text-xs bg-white text-blue-600 px-2 py-1 rounded-full font-bold">ACTIVE</span>
                    </div>
                    <button
                      onClick={() => handlePurchaseVoucher(voucher._id)}
                      className="w-full bg-white text-blue-600 hover:bg-blue-100 font-bold py-2 px-4 rounded-lg transition duration-200 shadow-md"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">My Vouchers</h2>
          {myVouchers.length === 0 ? (
            <p className="text-gray-600">You don't have any vouchers yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myVouchers.map((userVoucher) => (
                <div key={userVoucher._id} className="relative bg-gradient-to-br from-green-500 to-teal-600 text-white rounded-lg shadow-lg overflow-hidden">
                  <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: 'url(/assets/voucher.jpg)' }}></div>
                  <div className="p-6 relative z-10">
                    <h3 className="text-2xl font-bold mb-2">৳{userVoucher.voucher.discountAmount} OFF</h3>
                    <p className="text-sm mb-4">Purchased: {new Date(userVoucher.createdAt).toLocaleDateString()}</p>
                    
                    <div className="bg-white text-gray-800 p-4 rounded-md mb-4">
                      <p className="text-center text-lg font-semibold mb-2">Voucher Code:</p>
                      <div 
                        className={`text-center text-2xl font-bold tracking-widest ${userVoucher.showCode ? '' : 'blur-sm'}`}
                        onClick={() => toggleCodeVisibility(userVoucher._id)}
                      >
                        {userVoucher.code}
                      </div>
                      {!userVoucher.showCode && (
                        <p className="text-center text-sm text-gray-500 mt-2">Click to reveal code</p>
                      )}
                    </div>

                    {userVoucher.isRedeemed && (
                      <p className="text-red-200 text-sm text-center font-bold">REDEEMED</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
      {showToast && <Toast message={showToast.message} type={showToast.type} onClose={() => setShowToast(null)} />}
    </div>
  );
}
