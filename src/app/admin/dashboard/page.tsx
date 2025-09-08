'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FiUsers, FiMessageSquare, FiCreditCard, FiPlusSquare, FiEye } from 'react-icons/fi'; // Added FiEye

const data = [
  { name: "Mon", sales: 1200 },
  { name: "Tue", sales: 4500 },
  { name: "Wed", sales: 6000 },
  { name: "Thu", sales: 5000 },
  { name: "Fri", sales: 8000 },
  { name: "Sat", sales: 4000 },
  { name: "Sun", sales: 7000 },
];
const averagedata = [
  { name: "Jan", average: 40 },
  { name: "Feb", average: 55 },
  { name: "Mar", average: 50 },
  { name: "Apr", average: 65 },
  { name: "May", average: 60 },
  { name: "Jun", average: 70 },
];
const earningData = [
  { name: "Week 1", earning: 2500 },
  { name: "Week 2", earning: 3200 },
  { name: "Week 3", earning: 10000 },
  { name: "Week 4", earning: 6845 },
  { name: "Week 5", earning: 5500 },
  { name: "Week 6", earning: 5000 },
  { name: "Week 7", earning: 6000 },
  { name: "Week 8", earning: 7000 },
  { name: "Week 9", earning: 8000 },
  { name: "Week 10", earning: 9000 },
  { name: "Week 11", earning: 10000 },
  { name: "Week 12", earning: 11000 },
];
const totalEarnings = earningData.reduce((acc, curr) => acc + curr.earning, 0);

export default function Admin() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [jobCount, setJobCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          router.push('/admin/login');
          return;
        }
        const usersRes = await axios.get('http://localhost:5000/api/auth/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTotalUsers(usersRes.data.length);

        const jobCountRes = await axios.get('http://localhost:5000/api/jobs/count', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobCount(jobCountRes.data.count);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [router]);

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
            <div className="total-sell h-auto w-full bg-gradient-to-r from-gray-900 to-blue-300 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                    <Link href="/dashboard/total-sell">
                    <h2 className="text-2xl font-bold mb-2">Total Sell</h2>
                    <p className="text-lg mb-4">View total sales data</p>
                    <div className="h-[120px] ">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data}>
                                <XAxis dataKey="name" stroke="#f0e9e9ff" fontSize={15} />
                                <YAxis stroke="#fff" fontSize={12} />
                                <Tooltip />
                                <Bar dataKey="sales" fill="#333536ff" radius={[4, 4, 1, 1]} />
                                </BarChart>
                            </ResponsiveContainer>
                    </div>
                    </Link>
            </div>

            <div className="total-users h-auto w-full bg-gradient-to-r from-gray-900 to-blue-300 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 items-center flex flex-col justify-center">
                <h2 className="text-2xl font-bold mb-2">Total Users</h2>
                <p className="text-4xl font-bold">{totalUsers}</p>
            </div>

            <div className="manage-users h-auto w-full bg-gradient-to-r from-gray-900 to-blue-300 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 items-center flex flex-col justify-center">
                <Link href="/admin/users">
                    <FiUsers size={48} className="text-white mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Manage Users</h2>
                    <p className="text-lg">View and manage user accounts</p>
                </Link>
            </div>

            <div className="post-job h-auto w-full bg-gradient-to-r from-gray-900 to-blue-300 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 items-center flex flex-col justify-center">
                <Link href="/admin/jobs/new">
                    <h2 className="text-2xl font-bold mb-2">Post New Job</h2>
                    <p className="text-lg">Create a new job opening</p>
                </Link>
            </div>

            <div className="view-applications h-auto w-full bg-gradient-to-r from-gray-900 to-blue-300 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 items-center flex flex-col justify-center">
                <Link href="/admin/applications">
                    <h2 className="text-2xl font-bold mb-2">View Applications</h2>
                    <p className="text-lg">Review submitted job applications</p>
                </Link>
            </div>

            <div className="review h-auto w-full bg-gradient-to-r from-gray-900 to-blue-300 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 items-center flex flex-col justify-center">
                <Link href="/admin/feedback">
                    <FiMessageSquare size={48} className="text-white mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Review</h2>
                    <p className="text-lg">View customer reviews</p>
                </Link>
            </div>

            <div className="order h-auto w-full bg-gradient-to-r from-gray-900 to-blue-300 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 items-center flex flex-col justify-center">
                <Link href="/dashboard/order">
                <h2 className="text-2xl font-bold mb-2">Order</h2>
                <p className="text-lg">View all orders from online</p>
                </Link>
            </div>

            <div className="membership-applications h-auto w-full bg-gradient-to-r from-gray-900 to-blue-300 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 items-center flex flex-col justify-center">
                <Link href="/admin/membership">
                    <FiCreditCard size={48} className="text-white mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Membership Applications</h2>
                    <p className="text-lg">Review and manage membership applications</p>
                </Link>
            </div>

            <div className="add-voucher h-auto w-full bg-gradient-to-r from-gray-900 to-blue-300 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 items-center flex flex-col justify-center">
                <Link href="/admin/vouchers/add">
                    <FiPlusSquare size={48} className="text-white mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Add Voucher</h2>
                    <p className="text-lg">Create new discount vouchers</p>
                </Link>
            </div>

            <div className="view-user-vouchers h-auto w-full bg-gradient-to-r from-gray-900 to-blue-300 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 items-center flex flex-col justify-center">
                <Link href="/admin/vouchers/view">
                    <FiEye size={48} className="text-white mb-4" />
                    <h2 className="text-2xl font-bold mb-2">View User Vouchers</h2>
                    <p className="text-lg">View all purchased vouchers by users</p>
                </Link>
            </div>

            <div className="total-sell h-auto w-full">
                    <Link href="/dashboard/total-sell" className="bg-gradient-to-r from-gray-900 to-gray-300 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                    <h2 className="text-2xl font-bold mb-2">Average</h2>
                    <p className="text-lg mb-4">View average sales data</p>
                    <div className="h-[200px] ">
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={averagedata}>
                                <XAxis dataKey="name" stroke="#f0e9e9ff" fontSize={15} />
                                <YAxis stroke="#fff" fontSize={12} />
                                <Tooltip />
                                <Bar dataKey="average" fill="#333536ff" radius={[4, 4, 1, 1]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    </Link>
            </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <div className="w-full px-4 py-8 bg-gradient-to-r from-gray-900 to-gray-300 text-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-2">Total Earnings</h2>
                <p className="text-lg mb-4">Total earnings for 2025</p>
                <span className="text-3xl font-semibold">৳{totalEarnings}</span>
                <div className="h-[250px] flex">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={earningData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                            <XAxis dataKey="name" stroke="#e9dfdfff" />
                            <YAxis stroke="#dfd6d6ff" />
                            <Tooltip
                            contentStyle={{ backgroundColor: "#c3c4c7ff", borderRadius: "8px" }}
                            itemStyle={{ color: "#161515ff" }}
                            />
                            <Line
                            type="monotone"
                            dataKey="earning"
                            stroke="#0e0e0fff"
                            strokeWidth={3}
                            dot={{ r: 5, strokeWidth: 2, fill: "#60a5fa" }}
                            activeDot={{ r: 7 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="h-auto w-full bg-gradient-to-r from-gray-900 to-blue-300 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center text-center">
                <Link href="/admin/jobs/new">
                <h2 className="text-xl font-bold mb-1">Career</h2>
                <p className="text-md">Total Jobs: {jobCount}</p>
                <button className="mt-3 bg-gray-900 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors text-sm">
                    Post Job
                </button>
                </Link>
            </div>
        </div>
    </div>
  );
}