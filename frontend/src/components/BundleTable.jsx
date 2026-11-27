import { M } from '../store/db';

const BundleTable = ({ bundles, getItemName, onEdit, onRemove }) => {
  return (
    <section className="codes">
      <h2>All bundles</h2>
      <table>
        <thead>
          <tr><th>Bundle</th><th>Includes</th><th>Price</th><th>Availability</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {bundles.length === 0 && (
            <tr><td colSpan={5} className="muted">No bundles yet.</td></tr>
          )}
          {bundles.map(b => (
            <tr key={b.id}>
              <td>
                <div className="row">
                  {b.image
                    ? <img className="pth" src={b.image} alt="" />
                    : <div className="pth ph">No photo</div>}
                  <div>
                    <b>{b.name}</b>
                    <div className="muted small">{b.description}</div>
                  </div>
                </div>
              </td>
              <td>
                <div className="small muted">
                  {(b.items || []).map(i => `${i.quantity}× ${i.name || getItemName(i.item_id)}`).join(', ') || '—'}
                </div>
              </td>
              <td>{M(b.price)}</td>
              <td>
                <span className={`badge ${b.available ? 'p-Available' : 'p-Unavailable'}`}>
                  {b.available ? 'Available' : 'Unavailable'}
                </span>
              </td>
              <td>
                <button className="button secondary small" onClick={() => onEdit(b)}>Edit</button>
                <button className="button secondary small delete" style={{ marginLeft: 6 }} onClick={() => onRemove(b.id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default BundleTable;
