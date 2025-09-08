'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import Toast from '@/components/Toast';
import ResumeViewerModal from '@/components/ResumeViewerModal'; // Import ResumeViewerModal

interface Application {
  _id: string;
  jobId: {
    title: string;
  };
  name: string;
  email: string;
  resume: string;
  coverLetter: string;
  appliedAt: string;
}

export default function ApplicationDetailPage() {
  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  useEffect(() => {
    if (id) {
      const fetchApplication = async () => {
        try {
          const token = localStorage.getItem('adminToken');
          if (!token) {
            router.push('/admin/login');
            return;
          }
          const res = await axios.get(`http://localhost:5000/api/applications/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setApplication(res.data);
        } catch (error) {
          console.error('Error fetching application:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchApplication();
    }
  }, [id, router]);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsReplying(true);
    setToast(null);

    try {
      const token = localStorage.getItem('adminToken');
      await axios.post(`http://localhost:5000/api/applications/${id}/reply`, { message: replyMessage }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setToast({ message: 'Reply sent successfully!', type: 'success' });
      setReplyMessage('');
    } catch (error) {
      console.error('Error sending reply:', error);
      setToast({ message: 'Failed to send reply.', type: 'error' });
    } finally {
      setIsReplying(false);
    }
  };

  const handleViewResume = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading) {
    return <div className="text-center py-16">Loading...</div>;
  }

  if (!application) {
    return <div className="text-center py-16">Application not found.</div>;
  }

  const resumePath = 'uploads' + application.resume.split('uploads')[1].replace(/\\/g, '/'); // Corrected path for existing and new resumes

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Application for {application.jobId.title}</h1>
        <p className="text-gray-600 mb-6">Applied on: {new Date(application.appliedAt).toLocaleDateString()}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Applicant Details</h2>
            <p className="mt-4"><strong>Name:</strong> {application.name}</p>
            <p><strong>Email:</strong> {application.email}</p>
            <p className="mt-4">
              <strong>Resume:</strong>{' '}
              <a href={`http://localhost:5000/${resumePath}`} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline mr-4">
                Download Resume
              </a>
              <button onClick={handleViewResume} className="text-blue-600 hover:underline">
                View Resume
              </button>
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Cover Letter</h2>
            <p className="mt-4 text-gray-700">{application.coverLetter || 'No cover letter provided.'}</p>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800">Reply to Applicant</h2>
          <form onSubmit={handleReply} className="mt-4 space-y-4">
            <div>
              <label htmlFor="replyMessage" className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                id="replyMessage"
                name="replyMessage"
                rows={6}
                required
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              ></textarea>
            </div>
            <div>
              <button type="submit" disabled={isReplying} className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                {isReplying ? 'Sending...' : 'Send Reply'}
              </button>
            </div>
          </form>
        </div>
      </div>
      {application && (
        <ResumeViewerModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          resumeUrl={`http://localhost:5000/${resumePath}`}
        />
      )}
    </main>
  );
}