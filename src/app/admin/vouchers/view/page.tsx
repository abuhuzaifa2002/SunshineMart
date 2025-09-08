'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Toast from '../../../../components/Toast';

export default function AdminViewUserVouchersPage() {
  const [userVouchers, setUserVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchUserVouchers();
  }, []);

  const fetchUserVouchers = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    try {
      const res = await axios.get('http://localhost:5000/api/admin/user-vouchers', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserVouchers(res.data.userVouchers);
    } catch (err) {
      console.error('Error fetching user vouchers:', err);
      setError('Failed to fetch user vouchers.');
      setShowToast({ message: 'Failed to fetch user vouchers.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading user vouchers...</div>;
  if (error) return <div className="text-center py-8 text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">All User Vouchers</h1>

        {userVouchers.length === 0 ? (
          <p className="text-gray-600">No user vouchers found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">Voucher Code</th>
                  <th className="py-2 px-4 border-b text-left">Discount</th>
                  <th className="py-2 px-4 border-b text-left">Points Cost</th>
                  <th className="py-2 px-4 border-b text-left">User Name</th>
                  <th className="py-2 px-4 border-b text-left">User Email</th>
                  <th className="py-2 px-4 border-b text-left">Purchased On</th>
                  <th className="py-2 px-4 border-b text-left">Redeemed</th>
                  <th className="py-2 px-4 border-b text-left">Redeemed On</th>
                </tr>
              </thead>
              <tbody>
                {userVouchers.map((userVoucher) => (
                  <tr key={userVoucher._id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{userVoucher.code}</td>
                    <td className="py-2 px-4 border-b">৳{userVoucher.voucher.discountAmount}</td>
                    <td className="py-2 px-4 border-b">{userVoucher.voucher.pointsCost}</td>
                    <td className="py-2 px-4 border-b">{userVoucher.user.name}</td>
                    <td className="py-2 px-4 border-b">{userVoucher.user.email}</td>
                    <td className="py-2 px-4 border-b">{new Date(userVoucher.createdAt).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border-b">{userVoucher.isRedeemed ? 'Yes' : 'No'}</td>
                    <td className="py-2 px-4 border-b">{userVoucher.redeemedAt ? new Date(userVoucher.redeemedAt).toLocaleDateString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {showToast && <Toast message={showToast.message} type={showToast.type} onClose={() => setShowToast(null)} />}
    </div>
  );
}
