import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import AdminPageHeader from '../components/AdminPageHeader';
import Alert from '../components/Alert';
import FeedbackTable from '../components/FeedbackTable';
import { api } from '../store/api';

export default function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    api.get('/feedback')
      .then(res => setFeedback(res.feedback || []))
      .catch(e  => setError(e.message || 'Failed to load feedback.'))
      .finally(() => setLoading(false));
  }, []);

  const avg = feedback.length
    ? (feedback.reduce((t, f) => t + Number(f.rating), 0) / feedback.length).toFixed(1)
    : '0.0';

  return (
    <AdminLayout>
      <AdminPageHeader title="Customer Feedback" subtitle="Ratings and comments from delivered orders." />
      <Alert text={error} />
      <FeedbackTable feedback={feedback} loading={loading} avg={avg} />
    </AdminLayout>
  );
}
