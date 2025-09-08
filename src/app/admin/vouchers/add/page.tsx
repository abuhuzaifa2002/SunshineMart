'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Toast from '../../../../components/Toast';

export default function AddVoucherPage() {
  const [code, setCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState('');
  const [pointsCost, setPointsCost] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [showToast, setShowToast] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/admin/vouchers', 
        { code, discountAmount: Number(discountAmount), pointsCost: Number(pointsCost), isActive },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowToast({ message: res.data.message || 'Voucher created successfully!', type: 'success' });
      setCode('');
      setDiscountAmount('');
      setPointsCost('');
      setIsActive(true);
    } catch (error) {
      console.error('Error creating voucher:', error);
      setShowToast({ message: error.response?.data?.message || 'Failed to create voucher.', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Add New Voucher</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-gray-700 text-sm font-bold mb-2">Voucher Code</label>
            <input type="text" id="code" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={code} onChange={(e) => setCode(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="discountAmount" className="block text-gray-700 text-sm font-bold mb-2">Discount Amount (e.g., 100, 500)</label>
            <input type="number" id="discountAmount" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={discountAmount} onChange={(e) => setDiscountAmount(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="pointsCost" className="block text-gray-700 text-sm font-bold mb-2">Points Cost</label>
            <input type="number" id="pointsCost" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={pointsCost} onChange={(e) => setPointsCost(e.target.value)} required />
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="isActive" className="mr-2 leading-tight" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
            <label htmlFor="isActive" className="text-sm text-gray-700">Is Active</label>
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200">Create Voucher</button>
        </form>
      </div>
      {showToast && <Toast message={showToast.message} type={showToast.type} onClose={() => setShowToast(null)} />}
    </div>
  );
}
