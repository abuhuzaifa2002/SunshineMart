'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import Toast from '@/components/Toast';

interface Job {
  _id: string;
  title: string;
  description: string;
  requirements: string;
  location: string;
  createdAt: string;
}

export default function JobDetailPage() {
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    coverLetter: '',
  });
  const [resume, setResume] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    if (id) {
      const fetchJob = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/jobs/${id}`);
          setJob(res.data);
        } catch (error) {
          console.error('Error fetching job:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchJob();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setResume(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resume) {
      setToast({ message: 'Please upload your resume.', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    setToast(null);

    const applicationData = new FormData();
    applicationData.append('name', formData.name);
    applicationData.append('email', formData.email);
    applicationData.append('coverLetter', formData.coverLetter);
    applicationData.append('resume', resume);

    try {
      await axios.post(`http://localhost:5000/api/jobs/${id}/apply`, applicationData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setToast({ message: 'Application submitted successfully!', type: 'success' });
      setFormData({ name: '', email: '', coverLetter: '' });
      setResume(null);
    } catch (error) {
      console.error('Error submitting application:', error);
      setToast({ message: 'Failed to submit application.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-16">Loading...</div>;
  }

  if (!job) {
    return <div className="text-center py-16">Job not found.</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 py-16 px-4">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-4xl font-bold font-display text-gray-900">{job.title}</h1>
          <p className="mt-2 text-lg text-gray-600">{job.location}</p>
          <p className="mt-2 text-sm text-gray-500">Posted on: {new Date(job.createdAt).toLocaleDateString()}</p>

          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800">Job Description</h2>
            <p className="mt-4 text-gray-700">{job.description}</p>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800">Requirements</h2>
            <p className="mt-4 text-gray-700">{job.requirements}</p>
          </div>

          <div className="mt-12">
            <h2 className="text-3xl font-bold text-center text-gray-900">Apply for this position</h2>
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" />
              </div>
              <div>
                <label htmlFor="resume" className="block text-sm font-medium text-gray-700">Resume</label>
                <input type="file" name="resume" id="resume" accept=".pdf,.doc,.docx,.jpeg,.jpg,.png,.gif" required onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100" />
              </div>
              <div>
                <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700">Cover Letter (Optional)</label>
                <textarea name="coverLetter" id="coverLetter" rows={5} value={formData.coverLetter} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"></textarea>
              </div>
              <div>
                <button type="submit" disabled={isSubmitting} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
