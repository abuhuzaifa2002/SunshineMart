'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface Job {
  _id: string;
  title: string;
  description: string;
  location: string;
  createdAt: string;
}

export default function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/jobs');
        setJobs(res.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-display text-gray-900">Join Our Team</h1>
          <p className="mt-2 text-lg text-gray-600">Explore exciting career opportunities at Sunshine.</p>
        </div>

        {isLoading ? (
          <div className="text-center">
            <p>Loading...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {jobs.map((job) => (
              <div key={job._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{job.title}</h2>
                    <p className="text-gray-600">{job.location}</p>
                  </div>
                  <Link href={`/careers/${job._id}`} className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                    View Details
                  </Link>
                </div>
                <p className="mt-4 text-gray-700 line-clamp-3">{job.description}</p>
                <p className="mt-4 text-sm text-gray-500">Posted on: {new Date(job.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}