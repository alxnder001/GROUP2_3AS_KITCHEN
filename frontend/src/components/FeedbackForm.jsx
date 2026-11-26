import { M } from '../store/db';

const RATINGS = [
  { v: 1, stars: '★',     label: 'Poor'      },
  { v: 2, stars: '★★',    label: 'Fair'      },
  { v: 3, stars: '★★★',   label: 'Good'      },
  { v: 4, stars: '★★★★',  label: 'Great'     },
  { v: 5, stars: '★★★★★', label: 'Excellent' },
];

const lines = o => (o.items || []).map(it => `${it.quantity} × ${it.name}`).join(', ');

const FeedbackForm = ({
  selOrder, selId, orders,
  rating, onRating, comment, setComment,
  onSubmit, onCancel, rateErr, submitting,
}) => {
  if (selOrder) {
    return (
      <div className="card col fb-form">
        <div className="row between">
          <div>
            <h2>How was Order #{selOrder.id}?</h2>
            <div className="muted small">
              {lines(selOrder)} · {M(selOrder.total)} · Delivered {selOrder.created_at?.slice(0, 10) || ''}
            </div>
          </div>
          <span className="badge p-Delivered">Delivered</span>
        </div>

        {/* Star rating */}
        <div className="rate">
          {RATINGS.map(r => (
            <button key={r.v}
              className={`button secondary${rating === r.v ? ' on' : ''}`}
              onClick={() => onRating(r.v)}
              aria-pressed={rating === r.v}>
              <span className="stars-gold">{r.stars}</span>
              <span className="small">{r.label}</span>
            </button>
          ))}
        </div>
        {rateErr && <p className="er">{rateErr}</p>}

        {/* Comment */}
        <label className="field grow">
          Comments (optional)
          <textarea maxLength={300}
            placeholder="Tell us about the food, the delivery, or the rider"
            value={comment}
            onChange={e => setComment(e.target.value)} />
        </label>
        <p className="muted small">Maximum of 300 characters.</p>

        <div className="row">
          <button className="button" onClick={onSubmit} disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit Feedback'}
          </button>
          <button className="button secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card muted center-box">
      {selId && orders.find(o => o.id === selId)?.has_feedback
        ? 'You have already submitted feedback for this order.'
        : 'All caught up. No orders waiting for feedback.'}
    </div>
  );
};

export default FeedbackForm;
