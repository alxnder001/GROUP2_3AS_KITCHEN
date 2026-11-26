import { M } from '../store/db';

const lines = o => (o.items || []).map(it => `${it.quantity} × ${it.name}`).join(', ');

const FeedbackPicker = ({ orders, loading, selId, onSelect }) => {
  return (
    <div className="col">
      {loading && <div className="card muted">Loading orders…</div>}

      {!loading && orders.length === 0 && (
        <div className="card muted">No delivered orders yet.</div>
      )}

      {orders.map(o => (
        <button key={o.id}
          className={`order-pick${selId === o.id ? ' on' : ''}`}
          onClick={() => { if (!o.has_feedback) onSelect(o.id); }}
          disabled={!!o.has_feedback}>
          <div className="line">
            <b>Order #{o.id}</b>
            {o.has_feedback
              ? <span className="badge p-Delivered">Feedback sent</span>
              : <span className="badge p-Pending">To rate</span>}
          </div>
          <div className="muted small">{o.created_at?.slice(0, 10) || ''} · {M(o.total)}</div>
          <div className="small">{lines(o)}</div>
        </button>
      ))}
    </div>
  );
};

export default FeedbackPicker;
