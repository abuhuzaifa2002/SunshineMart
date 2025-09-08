'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function AdminMembershipPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    try {
      const res = await axios.get('http://localhost:5000/api/membership/applications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data.applications);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to fetch applications.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    try {
      await axios.put(`http://localhost:5000/api/membership/applications/${id}`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchApplications(); // Refresh the list
    } catch (err) {
      console.error(`Error updating status for ${id}:`, err);
      setError(`Failed to update status for application ${id}.`);
    }
  };

  if (loading) return <div className="text-center py-8">Loading applications...</div>;
  if (error) return <div className="text-center py-8 text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Membership Applications</h1>

        {applications.length === 0 ? (
          <p className="text-gray-600">No membership applications found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">Name</th>
                  <th className="py-2 px-4 border-b text-left">Email</th>
                  <th className="py-2 px-4 border-b text-left">Phone</th>
                  <th className="py-2 px-4 border-b text-left">Status</th>
                  <th className="py-2 px-4 border-b text-left">Applied On</th>
                  <th className="py-2 px-4 border-b text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{app.name}</td>
                    <td className="py-2 px-4 border-b">{app.email}</td>
                    <td className="py-2 px-4 border-b">{app.phone}</td>
                    <td className="py-2 px-4 border-b">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${app.status === 'approved' ? 'bg-green-100 text-green-800' :
                          app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'}`}>
                        {app.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b">{new Date(app.createdAt).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border-b text-center">
                      {app.status === 'pending' && (
                        <div className="space-x-2">
                          <button
                            onClick={() => handleStatusUpdate(app._id, 'approved')}
                            className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(app._id, 'declined')}
                            className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm"
                          >
                            Decline
                          </button>
                        </div>
                      )}
                      {app.status !== 'pending' && (
                        <span className="text-gray-500 text-sm">Action Taken</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
