import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, logout } from '../store/api';
import { takeNote } from '../store/db';
import CustomerLayout from '../components/CustomerLayout';
import PageIntro from '../components/PageIntro';
import Alert from '../components/Alert';
import SuccessNote from '../components/SuccessNote';
import FeedbackPicker from '../components/FeedbackPicker';
import FeedbackForm from '../components/FeedbackForm';
import '../styles/base.css';
import '../styles/menu.css';
import '../styles/feedback.css';

export default function FeedbackPage() {
  const navigate = useNavigate();
  const name  = localStorage.getItem('3a_kitchen_name') || '';
  const email = localStorage.getItem('3a_kitchen_user') || '';
  const role  = localStorage.getItem('3a_kitchen_role') || '';

  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [note]    = useState(() => takeNote());

  const [selId, setSelId] = useState(() => {
    const fbo = sessionStorage.getItem('3a_fbo');
    sessionStorage.removeItem('3a_fbo');
    return fbo ? Number(fbo) : null;
  });
  const [rating,     setRating]     = useState(0);
  const [comment,    setComment]    = useState('');
  const [rateErr,    setRateErr]    = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // ── guard: customers only ─────────────────────────────────
  useEffect(() => {
    if (!email || role !== 'c') navigate('/login', { replace: true });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── load delivered orders from API ───────────────────────
  useEffect(() => {
    setLoading(true);
    api.get('/orders/mine')
      .then(data => {
        const delivered = (data.orders || []).filter(o => o.status === 'Delivered');
        setOrders(delivered);
      })
      .catch(err => setError(err.message || 'Failed to load orders.'))
      .finally(() => setLoading(false));
  }, []);

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  const onSelect = id => { setSelId(id); setRating(0); setComment(''); setRateErr(''); };

  async function handleSubmit() {
    if (!rating) {
      setRateErr('Please select a rating before submitting your feedback.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/feedback', {
        order_id: selId,
        rating,
        comment: comment.slice(0, 300),
      });

      // Mark the order as having feedback locally so the UI updates immediately
      setOrders(prev => prev.map(o =>
        o.id === selId ? { ...o, has_feedback: true } : o
      ));

      setSuccessMsg(`Thank you! Your feedback for Order #${selId} has been sent.`);
      setRating(0);
      setSelId(null);
      setComment('');
      setRateErr('');
    } catch (err) {
      setRateErr(err.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const selOrder = orders.find(o => o.id === selId && !o.has_feedback);

  return (
    <CustomerLayout active="feedback" name={name} onLogout={handleLogout}>
      <PageIntro title="Give Feedback" subtitle="Rate your delivered orders. Feedback can be sent once per order." />

      <SuccessNote text={successMsg || note} />
      <Alert text={error} />

      <div className="fb-layout">
        <FeedbackPicker
          orders={orders}
          loading={loading}
          selId={selId}
          onSelect={onSelect}
        />
        <FeedbackForm
          selOrder={selOrder}
          selId={selId}
          orders={orders}
          rating={rating}
          onRating={v => { setRating(v); setRateErr(''); }}
          comment={comment}
          setComment={setComment}
          onSubmit={handleSubmit}
          onCancel={() => { setSelId(null); setRating(0); setComment(''); setRateErr(''); }}
          rateErr={rateErr}
          submitting={submitting}
        />
      </div>
    </CustomerLayout>
  );
}
