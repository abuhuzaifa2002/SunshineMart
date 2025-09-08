'use client';

import { FiEdit, FiTrash2, FiArrowLeft, FiUser } from 'react-icons/fi';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import React, { useState, useEffect } from 'react';
import Toast from '../../../components/Toast';

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [editingUser, setEditingUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          router.push('/admin/login');
          return;
        }
        const usersRes = await axios.get('http://localhost:5000/api/auth/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(usersRes.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setToast({ message: 'Failed to load users.', type: 'error' });
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
      }
    };
    fetchUsers();
  }, [router]);

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('adminToken');
        await axios.delete(`http://localhost:5000/api/auth/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(users.filter((user: any) => user._id !== userId));
        setToast({ message: 'User deleted successfully!', type: 'success' });
      } catch (error) {
        console.error('Error deleting user:', error);
        setToast({ message: 'Failed to delete user.', type: 'error' });
      }
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.put(`http://localhost:5000/api/auth/users/${editingUser._id}`, editingUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.map((user: any) => (user._id === editingUser._id ? res.data.user : user)));
      setToast({ message: 'User updated successfully!', type: 'success' });
      setEditingUser(null); // Close modal
    } catch (error) {
      console.error('Error updating user:', error);
      setToast({ message: 'Failed to update user.', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-7xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-semibold">Manage Users</h2>
          <Link href="/admin/dashboard" className="flex items-center text-orange-500 hover:underline">
            <FiArrowLeft className="mr-2" /> Back to Dashboard
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Profile Pic</th>
                <th className="py-2 px-4 border-b text-left">Name</th>
                <th className="py-2 px-4 border-b text-left">Email</th>
                <th className="py-2 px-4 border-b text-left">Verified</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: any) => (
                <tr key={user._id}>
                  <td className="py-2 px-4 border-b">
                    {user.profilePicture ? (
                      <img src={`http://localhost:5000${user.profilePicture}`} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <FiUser className="w-10 h-10 rounded-full bg-gray-200 p-1" />
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">{user.name}</td>
                  <td className="py-2 px-4 border-b">{user.email}</td>
                  <td className="py-2 px-4 border-b">{user.isVerified ? 'Yes' : 'No'}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => setEditingUser(user)}
                      className="text-blue-600 hover:text-blue-800 mr-2"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Edit User</h3>
            <form onSubmit={handleUpdateUser}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  <input
                    type="checkbox"
                    checked={editingUser.isVerified}
                    onChange={(e) => setEditingUser({ ...editingUser, isVerified: e.target.checked })}
                    className="mr-2 leading-tight"
                  />
                  <span className="text-sm">Verified</span>
                </label>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsersPage;