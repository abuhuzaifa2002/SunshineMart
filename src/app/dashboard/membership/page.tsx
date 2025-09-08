'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Toast from '../../../components/Toast'; // Import Toast component

export default function MembershipPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [applicationStatus, setApplicationStatus] = useState('loading'); // loading, not applied, pending, approved, declined
  const [membershipData, setMembershipData] = useState(null);
  const [message, setMessage] = useState('');
  const [topupAmount, setTopupAmount] = useState('');
  const [showToast, setShowToast] = useState(null); // State for toast
  const [voucherHistory, setVoucherHistory] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchMembershipStatus = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      try {
        const res = await axios.get('http://localhost:5000/api/membership/status', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplicationStatus(res.data.status);
        if (res.data.status === 'approved') {
          setMembershipData(res.data);
          // Fetch voucher history if approved
          const historyRes = await axios.get('http://localhost:5000/api/vouchers/my-vouchers', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setVoucherHistory(historyRes.data.myVouchers);
        }
      } catch (error) {
        console.error('Error fetching membership status or voucher history:', error);
        setApplicationStatus('not applied');
      }
    };
    fetchMembershipStatus();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/membership/apply', 
        { name, email, phone },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowToast({ message: res.data.message || 'Application submitted successfully!', type: 'success' });
      setApplicationStatus('pending');
    } catch (error) {
      console.error('Error submitting application:', error);
      setShowToast({ message: error.response?.data?.message || 'Failed to submit application.', type: 'error' });
    }
  };

  const handleTopup = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    try {
      const res = await axios.put('http://localhost:5000/api/membership/topup-points', 
        { points: Number(topupAmount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMembershipData(res.data.application); // Update membership data with new points
      setShowToast({ message: res.data.message || 'Points topped up successfully!', type: 'success' });
      setTopupAmount(''); // Clear input
    } catch (error) {
      console.error('Error topping up points:', error);
      setShowToast({ message: error.response?.data?.message || 'Failed to top up points.', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Membership Application</h1>

        {applicationStatus === 'loading' && (
          <p className="text-gray-600">Loading membership status...</p>
        )}

        {applicationStatus === 'not applied' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-gray-700 mb-4">Apply to become a member and enjoy exclusive benefits!</p>
            <div>
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name</label>
              <input type="text" id="name" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input type="email" id="email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
              <input type="tel" id="phone" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200">Submit Application</button>
          </form>
        )}

        {applicationStatus === 'pending' && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
            <p className="font-bold">Application Pending</p>
            <p>Your membership application is currently under review. We will notify you once it has been processed.</p>
          </div>
        )}

        {applicationStatus === 'declined' && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
            <p className="font-bold">Application Declined</p>
            <p>Unfortunately, your membership application has been declined. Please contact support for more information.</p>
          </div>
        )}

        {applicationStatus === 'approved' && membershipData && (
          <div className="mt-8 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Membership Card</h2>
            <MembershipCard data={membershipData} />

            <div className="mt-8 w-full max-w-md p-6 bg-gray-50 rounded-lg shadow-inner">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Top Up Points</h2>
              <form onSubmit={handleTopup} className="space-y-4">
                <div>
                  <label htmlFor="topupAmount" className="block text-gray-700 text-sm font-bold mb-2">Amount (500 - 50,000)</label>
                  <input 
                    type="number" 
                    id="topupAmount" 
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={topupAmount}
                    onChange={(e) => setTopupAmount(e.target.value)}
                    min="500"
                    max="50000"
                    required
                  />
                </div>
                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200">Top Up Points</button>
              </form>
            </div>

            <div className="mt-8 w-full max-w-md p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Voucher Purchase History</h2>
              {voucherHistory.length === 0 ? (
                <p className="text-gray-600">No voucher purchases yet.</p>
              ) : (
                <div className="space-y-4">
                  {voucherHistory.map((historyItem) => (
                    <div key={historyItem._id} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-semibold text-gray-800">{historyItem.voucher.discountAmount} Taka Off Voucher</p>
                        <p className="text-sm text-gray-600">Code: {historyItem.code}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-red-600">-{historyItem.voucher.pointsCost} Points</p>
                        <p className="text-xs text-gray-500">{new Date(historyItem.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {showToast && <Toast message={showToast.message} type={showToast.type} onClose={() => setShowToast(null)} />}
    </div>
  );
}

function MembershipCard({ data }) {
  return (
    <div className="relative w-96 h-56 rounded-xl shadow-lg overflow-hidden bg-gradient-to-br from-purple-600 to-indigo-600 text-white p-6 flex flex-col justify-between font-sans">
      {/* Background Pattern/Texture */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M5 0h1L0 6V5zM6 5v1H5z\'%2F%3E%3C/g%3E%3C/svg%3E")' }}></div>
      
      {/* Top Section */}
      <div className="flex justify-between items-start z-10">
        <h3 className="text-xl font-bold">Sunshine Member</h3>
        <span className="text-lg font-semibold">POINTS: {data.points}</span>
      </div>

      {/* Chip Placeholder */}
      <div className="w-12 h-8 bg-yellow-400 rounded-md shadow-inner z-10"></div>

      {/* Card Number Placeholder */}
      <p className="text-2xl font-mono tracking-widest z-10">**** **** **** 1234</p>

      {/* User Info */}
      <div className="z-10">
        <p className="text-sm opacity-80">Card Holder</p>
        <p className="text-xl font-semibold mb-1">{data.name}</p>
        <p className="text-xs opacity-70">Email: {data.email}</p>
        <p className="text-xs opacity-70">Phone: {data.phone}</p>
      </div>

      {/* Bottom Section */}
      <div className="flex justify-between items-end text-xs opacity-70 z-10">
        <span>MEMBER SINCE: {new Date(data.createdAt).toLocaleDateString()}</span>
        <span>ID: {data._id.slice(-6).toUpperCase()}</span>
      </div>
    </div>
  );
}
