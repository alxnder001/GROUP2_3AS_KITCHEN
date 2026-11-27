import ModalShell from './ModalShell';

const BundleModal = ({
  form, setForm, errors, imgErr, fileRef, allItems,
  onAddItem, onUpdateItem, onRemoveItem, onImg, onClearImage, onClose, onSave,
}) => {
  return (
    <ModalShell title={form.id ? 'Edit Bundle' : 'Add Bundle'} onClose={onClose}>
      <div style={{ marginTop: 14 }}>
        <label className="field">Bundle name
          <input type="text" placeholder="e.g. Family Fiesta Tray"
            value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className={errors.name ? 'bad' : ''} />
        </label>
        {errors.name && <p className="er">{errors.name}</p>}
      </div>

      <div style={{ marginTop: 14 }}>
        <label className="field">Description
          <input type="text" placeholder="e.g. Serves 8-10 people"
            value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        </label>
      </div>

      <div style={{ marginTop: 14 }}>
        <label className="field">Bundle Price (₱)
          <input type="number" placeholder="0.00" min="0" step="any"
            value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
            className={errors.price ? 'bad' : ''} />
        </label>
        {errors.price && <p className="er">{errors.price}</p>}
      </div>

      {/* Bundle items */}
      <div style={{ marginTop: 14 }}>
        <div className="row between" style={{ marginBottom: 8 }}>
          <label className="field" style={{ margin: 0 }}>Products in this bundle</label>
          <button type="button" className="button secondary small" onClick={onAddItem}>+ Add Product</button>
        </div>
        {errors.items && <p className="er">{errors.items}</p>}
        {form.items.length === 0 && (
          <p className="muted small">No products added yet. Click "+ Add Product" to start.</p>
        )}
        {form.items.map((bi, idx) => (
          <div key={idx} className="row" style={{ marginTop: 8, gap: 8 }}>
            <select style={{ flex: 2, height: 36, margin: 0 }}
              value={bi.item_id}
              onChange={e => onUpdateItem(idx, 'item_id', e.target.value)}>
              {allItems.map(it => (
                <option key={it.id} value={it.id}>{it.name}</option>
              ))}
            </select>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span className="muted small">Qty:</span>
              <input type="number" min="1" style={{ width: 60, height: 36, margin: 0 }}
                value={bi.quantity}
                onChange={e => onUpdateItem(idx, 'quantity', e.target.value)} />
            </div>
            <button type="button" className="button secondary small delete"
              onClick={() => onRemoveItem(idx)}>✕</button>
          </div>
        ))}
      </div>

      {/* Photo */}
      <div style={{ marginTop: 14 }}>
        <div className="field">Bundle photo (optional)</div>
        {form.image
          ? <img className="prev" src={form.image} alt="Preview" />
          : <div className="ph prev">[No photo yet]</div>}
        <input ref={fileRef} type="file" accept="image/*" onChange={onImg} style={{ marginTop: 6 }} />
        {form.image && (
          <button className="button secondary small delete" style={{ marginTop: 6 }}
            onClick={onClearImage}>
            Remove photo
          </button>
        )}
        {imgErr && <p className="er">{imgErr}</p>}
      </div>

      <label className="check field" style={{ marginTop: 14 }}>
        <input type="checkbox" checked={form.available}
          onChange={e => setForm(f => ({ ...f, available: e.target.checked }))} />
        Available for ordering
      </label>

      <div className="form-actions">
        <button className="button secondary" onClick={onClose}>Cancel</button>
        <button className="button" onClick={onSave}>Save Bundle</button>
      </div>
    </ModalShell>
  );
};

export default BundleModal;
