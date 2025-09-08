'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Application {
  _id: string;
  jobId: {
    _id: string;
    title: string;
  };
  name: string;
  email: string;
  appliedAt: string;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          router.push('/admin/login');
          return;
        }

        const res = await axios.get('http://localhost:5000/api/applications', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(res.data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchApplications();
  }, [router]);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Job Applications</h1>
        {isLoading ? (
          <div className="text-center">
            <p>Loading...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Job Title</th>
                  <th className="py-2 px-4 border-b">Applicant Name</th>
                  <th className="py-2 px-4 border-b">Applicant Email</th>
                  <th className="py-2 px-4 border-b">Date Applied</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id}>
                    <td className="py-2 px-4 border-b">{app.jobId.title}</td>
                    <td className="py-2 px-4 border-b">{app.name}</td>
                    <td className="py-2 px-4 border-b">{app.email}</td>
                    <td className="py-2 px-4 border-b">{new Date(app.appliedAt).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border-b">
                      <Link href={`/admin/applications/${app._id}`} className="text-orange-600 hover:underline">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
