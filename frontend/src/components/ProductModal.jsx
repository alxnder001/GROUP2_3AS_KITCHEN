import ModalShell from './ModalShell';

const ProductModal = ({ form, setForm, errors, imgErr, fileRef, onImg, onClearImage, onClose, onSave }) => {
  return (
    <ModalShell title={form.id ? 'Edit Product' : 'Add Product'} onClose={onClose}>
      <div style={{ marginTop: 14 }}>
        <label className="field">Product name
          <input type="text" placeholder="e.g. Family Fiesta Tray"
            value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className={errors.pn ? 'bad' : ''} />
        </label>
        {errors.pn && <p className="er">{errors.pn}</p>}
      </div>

      <div style={{ marginTop: 14 }}>
        <label className="field">Description
          <input type="text" placeholder="Short description"
            value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        </label>
      </div>

      <div style={{ marginTop: 14 }}>
        <label className="field">Price (₱)
          <input type="number" min="1" max="9999" step="1"
            value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
            className={errors.pp ? 'bad' : ''} />
        </label>
        {errors.pp && <p className="er">{errors.pp}</p>}
      </div>

      <div style={{ marginTop: 14 }}>
        <label className="field">Cost of product (₱)
          <input type="number" min="0" max="9999" step="1"
            value={form.cost} onChange={e => setForm(f => ({ ...f, cost: e.target.value }))}
            className={errors.pc ? 'bad' : ''} />
        </label>
        {errors.pc && <p className="er">{errors.pc}</p>}
      </div>

      <div style={{ marginTop: 14 }}>
        <div className="field">Product photo (optional)</div>
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

      {/* Bundle checkbox */}
      <label className="check field" style={{ marginTop: 10 }}>
        <input type="checkbox" checked={form.is_bundle}
          onChange={e => setForm(f => ({ ...f, is_bundle: e.target.checked }))} />
        This is a bundle
      </label>
      {form.is_bundle && (
        <p className="muted small" style={{ marginTop: 4, marginLeft: 22 }}>
          This item will appear under the Bundles filter on the customer menu.
        </p>
      )}

      <div className="form-actions">
        <button className="button secondary" onClick={onClose}>Cancel</button>
        <button className="button" onClick={onSave}>Save Product</button>
      </div>
    </ModalShell>
  );
};

export default ProductModal;
