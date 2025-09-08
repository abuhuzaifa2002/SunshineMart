'use client';

import { useState, useEffect } from 'react';
import { FiArrowLeft, FiUser } from 'react-icons/fi';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Toast from '../../../components/Toast';
import Link from 'next/link';

export default function EditProfilePage() {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newProfilePicture, setNewProfilePicture] = useState<File | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }
        const res = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserName(res.data.name);
        setUserEmail(res.data.email);
        setProfilePicture(res.data.profilePicture || '');
        setNewName(res.data.name);
      } catch (error) {
        console.error('Error fetching user data:', error);
        localStorage.removeItem('token');
        router.push('/login');
      }
    };
    fetchUserData();
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setToast(null);

    if (newPassword && newPassword !== confirmPassword) {
      setToast({ message: 'Passwords do not match', type: 'error' });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      if (newName !== userName) {
        formData.append('name', newName);
      }
      if (newPassword) {
        formData.append('password', newPassword);
      }
      if (newProfilePicture) {
        formData.append('profilePicture', newProfilePicture);
      }

      if (Array.from(formData.entries()).length === 0) {
        setToast({ message: 'No changes to save', type: 'error' });
        return;
      }

      const res = await axios.put('http://localhost:5000/api/auth/me', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setUserName(res.data.user.name);
      setProfilePicture(res.data.user.profilePicture || '');
      setNewPassword('');
      setConfirmPassword('');
      setNewProfilePicture(null);
      setToast({ message: 'Profile updated successfully!', type: 'success' });
    } catch (error) {
      console.error('Error updating profile:', error);
      if (axios.isAxiosError(error) && error.response) {
        setToast({ message: error.response.data.message || 'Failed to update profile', type: 'error' });
      } else {
        setToast({ message: 'An unexpected error occurred', type: 'error' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-semibold">Edit Your Profile</h2>
          <Link href="/dashboard" className="flex items-center text-orange-500 hover:underline">
            <FiArrowLeft className="mr-2" /> Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="flex flex-col items-center mb-4">
            {profilePicture ? (
              <img src={`http://localhost:5000${profilePicture}`} alt="Profile" className="w-24 h-24 rounded-full object-cover mb-2" />
            ) : (
              <FiUser className="w-24 h-24 rounded-full bg-gray-200 p-4 mb-2" />
            )}
            <label htmlFor="profilePicture" className="cursor-pointer bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors">
              Upload Profile Picture
            </label>
            <input
              type="file"
              id="profilePicture"
              accept="image/*"
              onChange={(e) => setNewProfilePicture(e.target.files ? e.target.files[0] : null)}
              className="hidden"
            />
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={userEmail}
              disabled
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              id="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              placeholder="Leave blank to keep current password"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}
