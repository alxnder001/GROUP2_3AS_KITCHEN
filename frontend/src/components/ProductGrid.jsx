import { M } from '../store/db';

const ProductGrid = ({ filter, setFilter, items, loading, onAdd }) => {
  const visibleItems = items
    .filter(i => !i.deleted)
    .filter(i => {
      if (filter === 'bundles')     return !!i.is_bundle;
      if (filter === 'available')   return !!i.available;
      if (filter === 'unavailable') return !i.available;
      return true; // 'all'
    });

  return (
    <div>
      {/* ── Filter tabs ── */}
      <div className="menu-controls">
        <div className="filter-tabs">
          {[
            ['all',         'All Products'],
            ['bundles',     'Bundles'],
            ['available',   'Available'],
            ['unavailable', 'Unavailable'],
          ].map(([val, label]) => (
            <button
              key={val}
              className={`filter-tab${filter === val ? ' active' : ''}`}
              onClick={() => setFilter(val)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Products grid ── */}
      {loading ? (
        <p className="muted">Loading menu…</p>
      ) : (
        <div className="cards">
          {visibleItems.length === 0 && (
            <div className="card muted">No products found.</div>
          )}
          {visibleItems.map(it => (
            <div className="card food" key={it.id} style={{ opacity: it.available ? 1 : 0.7 }}>
              {it.image
                ? <img className="pimg" src={it.image} alt={it.name} />
                : <div className="food-ph">[Food photo]</div>}
              <div className="food-body">
                <b>{it.name}</b>
                <span className="muted small">{it.description}</span>
                {!it.available && (
                  <span className="alert small">Currently unavailable.</span>
                )}
                <div className="row between">
                  <b>{M(it.price)}</b>
                  <button
                    className="button small"
                    disabled={!it.available}
                    onClick={() => onAdd(it.id)}
                  >
                    {it.available ? 'Add to Cart' : 'Unavailable'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
