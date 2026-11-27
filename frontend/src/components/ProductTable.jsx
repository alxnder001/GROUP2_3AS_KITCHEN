const ProductTable = ({ items, loading, M, onEdit, onRemove }) => {
  return (
    <section className="codes">
      <h2>All products</h2>
      {loading ? (
        <p className="muted" style={{ padding: '16px 20px' }}>Loading products…</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Type</th>
              <th>Price</th>
              <th>Availability</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr><td colSpan={5} className="muted">No products yet.</td></tr>
            )}
            {items.map(it => (
              <tr key={it.id}>
                <td>
                  <div className="row">
                    {it.image
                      ? <img className="pth" src={it.image} alt="" />
                      : <div className="pth ph">No photo</div>}
                    <div>
                      <b>{it.name}</b>
                      <div className="muted small">{it.description}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`badge ${it.is_bundle ? 'p-Accepted' : 'p-Delivered'}`}>
                    {it.is_bundle ? 'Bundle' : 'Product'}
                  </span>
                </td>
                <td>{M(it.price)}</td>
                <td>
                  <span className={`badge ${it.available ? 'p-Available' : 'p-Unavailable'}`}>
                    {it.available ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td>
                  <button className="button secondary small" onClick={() => onEdit(it)}>Edit</button>
                  <button className="button secondary small delete" style={{ marginLeft: 6 }}
                    onClick={() => onRemove(it.id, it.name)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
};

export default ProductTable;
