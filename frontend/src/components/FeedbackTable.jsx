const FeedbackTable = ({ feedback, loading, avg }) => {
  return (
    <>
      <div className="stats">
        <div className="card stat">
          <span className="muted small">Average rating</span>
          <b className="ok">{avg} / 5</b>
        </div>
        <div className="card stat">
          <span className="muted small">Reviews</span>
          <b>{feedback.length}</b>
        </div>
      </div>

      <section className="codes">
        <h2>All reviews</h2>
        {loading ? (
          <p className="muted">Loading feedback…</p>
        ) : (
          <table>
            <thead>
              <tr><th>Order</th><th>Customer</th><th>Rating</th><th>Comment</th><th>Date</th></tr>
            </thead>
            <tbody>
              {feedback.length === 0
                ? <tr><td colSpan={5} className="muted">No feedback yet.</td></tr>
                : feedback.map(f => (
                    <tr key={f.id}>
                      <td>#{f.order_id}</td>
                      <td>{f.customer_name}</td>
                      <td className="stars">{'★'.repeat(f.rating)} {f.rating}/5</td>
                      <td>{f.comment || '—'}</td>
                      <td>{f.created_at ? f.created_at.slice(0, 10) : ''}</td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        )}
      </section>
    </>
  );
};

export default FeedbackTable;
