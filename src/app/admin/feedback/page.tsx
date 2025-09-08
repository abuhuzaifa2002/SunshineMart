'use client';

import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FiMail, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import Toast from '../../../components/Toast';

interface FeedbackItem {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
  replied: boolean;
  repliedAt?: string;
  replyMessage?: string;
}

export default function AdminFeedbackPage() {
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const router = useRouter();

  const fetchFeedback = useCallback(async () => {
    setLoading(true);
    setError(''); // Clear previous errors
    try {
      const token = localStorage.getItem('adminToken');
      console.log('Feedback Page - Admin Token from localStorage:', token); // Log token status

      if (!token) {
        console.warn('No admin token found. Redirecting to login.');
        router.push('/admin/login');
        return; // Stop execution if no token
      }

      const res = await axios.get('http://localhost:5000/api/feedback/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeedbackList(res.data);
      console.log('Feedback data response:', res.data);
    } catch (err) {
      console.error('Error fetching feedback:', err); // Log the full error
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Failed to fetch feedback');
        console.error('Backend error response:', err.response.data);
      } else {
        setError('An unexpected error occurred');
      }
      // If there's an error, especially 401/403, clear token and redirect
      localStorage.removeItem('adminToken');
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Call fetchFeedback when the component mounts
  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]); // Dependency array includes fetchFeedback to avoid stale closures

  const handleReply = async (feedbackId: string) => {
    if (!replyMessage) {
      setToast({ message: 'Reply message cannot be empty', type: 'error' });
      return;
    }
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setToast({ message: 'Authentication error: Please log in again.', type: 'error' });
        router.push('/admin/login');
        return;
      }
      await axios.post(
        `http://localhost:5000/api/feedback/reply/${feedbackId}`,
        { replyMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setToast({ message: 'Reply sent successfully!', type: 'success' });
      setReplyingTo(null);
      setReplyMessage('');
      fetchFeedback(); // Refresh the list after replying
    } catch (err) {
      console.error('Error sending reply:', err);
      if (axios.isAxiosError(err) && err.response) {
        setToast({ message: err.response.data.message || 'Failed to send reply', type: 'error' });
      } else {
        setToast({ message: 'An unexpected error occurred', type: 'error' });
      }
    }
  };

  if (loading) return <div className="text-center py-10">Loading feedback...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-amber-50 py-16 px-4">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold font-display text-gray-900 mb-8">Customer Feedback</h1>

        {feedbackList.length === 0 ? (
          <p className="text-center text-gray-600">No feedback submitted yet.</p>
        ) : (
          <div className="space-y-6">
            {feedbackList.map((feedback: FeedbackItem) => (
              <div key={feedback._id} className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-lg font-semibold text-gray-800">{feedback.name} ({feedback.email})</p>
                    {feedback.phone && <p className="text-sm text-gray-500">Phone: {feedback.phone}</p>}
                    <p className="text-sm text-gray-500">Submitted: {new Date(feedback.createdAt).toLocaleString()}</p>
                  </div>
                  {feedback.replied ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <FiCheckCircle className="mr-1" /> Replied
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      <FiXCircle className="mr-1" /> Pending
                    </span>
                  )}
                </div>
                <p className="text-gray-700 mb-4">{feedback.message}</p>

                {feedback.replied && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-md border border-blue-200">
                    <p className="font-semibold text-blue-800">Admin Reply ({new Date(feedback.repliedAt!).toLocaleString()}):</p>
                    <p className="text-blue-700">{feedback.replyMessage}</p>
                  </div>
                )}

                {!feedback.replied && (replyingTo === feedback._id ? (
                  <div className="mt-4">
                    <textarea
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 mb-2"
                      rows={3}
                      placeholder="Type your reply here..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                    ></textarea>
                    <button
                      onClick={() => handleReply(feedback._id)}
                      className="bg-orange-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-orange-700 transition-all duration-300"
                    >
                      Send Reply
                    </button>
                    <button
                      onClick={() => setReplyingTo(null)}
                      className="ml-2 bg-gray-300 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-400 transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setReplyingTo(feedback._id)}
                    className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-all duration-300"
                  >
                    <FiMail className="inline-block mr-2" /> Reply
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}