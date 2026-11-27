import { M } from '../store/db';

const CartPanel = ({
  cartEntries, resolveCart,
  subtotal, fee, rushFee, total, discount, promo, promoApplied,
  errors, setErrors,
  barangay, setBarangay, street, setStreet, landmark, setLandmark,
  contact, setContact, notes, setNotes, date, setDate, time, setTime, rush, setRush,
  today, placing, addCart, decCart, applyPromo, onPromoChange, onPlace,
}) => {
  return (
    <aside className="card col cart-panel">
      <h2>Your Order</h2>

      {errors.cart    && <div className="alert">{errors.cart}</div>}
      {errors.general && <div className="alert">{errors.general}</div>}

      <div>
        {cartEntries.length === 0
          ? <p className="muted">Your cart is empty.</p>
          : cartEntries.map(([key, qty]) => {
              const r = resolveCart(key);
              return (
                <div className="ci" key={key}>
                  <div>
                    <b>{r.name}</b>
                    <div className="muted small">{M(r.price)} each</div>
                  </div>
                  <div className="q">
                    <button className="button secondary small sq"
                      onClick={() => decCart(key)} aria-label="Decrease">−</button>
                    {qty}
                    <button className="button secondary small sq"
                      onClick={() => addCart(key)} aria-label="Increase">+</button>
                  </div>
                  <b>{M(r.price * qty)}</b>
                </div>
              );
            })
        }
      </div>

      {cartEntries.length > 0 && (
        <div className="dcbox">
          <label className="field">Discount code (optional)</label>
          <div className="code-row">
            <div>
              <input type="text" placeholder="e.g. 3A-FIESTA10" value={promo}
                onChange={onPromoChange}
                className={errors.pc ? 'bad' : ''}
                onKeyDown={e => e.key === 'Enter' && applyPromo()} />
            </div>
            <button className="button secondary" onClick={applyPromo} type="button">Apply</button>
          </div>
          {promoApplied && !errors.pc && (
            <p className="ok small">Code <b>{promoApplied}</b> applied — you save {M(discount)}!</p>
          )}
          {errors.pc && <p className="er">{errors.pc}</p>}
        </div>
      )}

      <div className="totals">
        <div className="line"><span className="muted">Subtotal</span><span>{M(subtotal)}</span></div>
        {discount > 0 && (
          <div className="line ok">
            <span>Discount ({promoApplied})</span>
            <span>−{M(discount)}</span>
          </div>
        )}
        <div className="line">
          <span className="muted">Delivery fee</span>
          <span>{barangay ? M(fee) : <span className="muted small">Select barangay</span>}</span>
        </div>
        {rush && (
          <div className="line rush-fee-line">
            <span>Rush fee</span>
            <span>+{M(rushFee)}</span>
          </div>
        )}
        <div className="line"><b>Total</b><b className="big">{M(total)}</b></div>
      </div>

      {/* ── Delivery Address ── */}
      <div className="addr-section">
        <p className="field" style={{ marginBottom: 8 }}>
          <b>Delivery Address</b>
        </p>

        <div>
          <label className="field">Barangay <span className="er" style={{ display:'inline' }}>*</span>
            <select value={barangay}
              onChange={e => { setBarangay(e.target.value); setErrors(x => ({ ...x, addr: '' })); }}
              className={errors.addr ? 'bad' : ''}>
              <option value="">— Select barangay —</option>
              <option>Dila</option>
              <option>Caluangan</option>
              <option>Puting Bato East</option>
              <option>Puting Bato West</option>
              <option>Sinisian East</option>
              <option>Sinisian West</option>
              <option>Baclas</option>
              <option>Coral ni Bacal</option>
            </select>
          </label>
          {errors.addr && <p className="er">{errors.addr}</p>}
        </div>

        <div style={{ marginTop: 10 }}>
          <label className="field">Purok / Street / Sitio <span className="er" style={{ display:'inline' }}>*</span>
            <input type="text" placeholder="Enter your purok, street, or sitio"
              value={street} onChange={e => { setStreet(e.target.value); setErrors(x => ({ ...x, street: '' })); }}
              className={errors.street ? 'bad' : ''} />
          </label>
          {errors.street && <p className="er">{errors.street}</p>}
        </div>

        <div style={{ marginTop: 10 }}>
          <label className="field">House Number / Landmark
            <input type="text" placeholder="House number or nearby landmark (e.g., near chapel, sari-sari store)"
              value={landmark} onChange={e => setLandmark(e.target.value)} />
          </label>
        </div>

        <div style={{ marginTop: 10 }}>
          <label className="field">Contact Number <span className="er" style={{ display:'inline' }}>*</span>
            <input type="tel" placeholder="Enter your contact number" maxLength={11}
              value={contact}
              onChange={e => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 11);
                setContact(val);
                setErrors(x => ({ ...x, contact: '' }));
              }}
              className={errors.contact ? 'bad' : ''} />
          </label>
          {errors.contact && <p className="er">{errors.contact}</p>}
        </div>

        <div style={{ marginTop: 10 }}>
          <label className="field">Delivery Notes
            <input type="text" placeholder="Additional instructions for the rider"
              value={notes} onChange={e => setNotes(e.target.value)} />
          </label>
        </div>
      </div>

      <div>
        <label className="field">Preferred delivery date
          <input type="date" min={today} value={date}
            onChange={e => { setDate(e.target.value); setErrors(x => ({ ...x, date: '' })); }}
            className={errors.date ? 'bad' : ''} />
        </label>
        {errors.date && <p className="er">{errors.date}</p>}
      </div>

      {date && (
        <div style={{ marginTop: 10 }}>
          <label className="field">Preferred delivery time
            <input type="time" value={time}
              onChange={e => { setTime(e.target.value); setErrors(x => ({ ...x, time: '' })); }}
              className={errors.time ? 'bad' : ''} />
          </label>
          {errors.time && <p className="er">{errors.time}</p>}
        </div>
      )}

      <div className="cod">
        <b>Cash on Delivery</b>
        <div className="muted small">Pay the rider when your order arrives.</div>
      </div>

      {/* Rush order checkbox */}
      <label className="rush-check">
        <input type="checkbox" checked={rush} onChange={e => setRush(e.target.checked)} />
        <div>
          <span className="rush-label">Rush Order</span>
          <span className="muted small">Mark this if you need it prioritized ASAP.</span>
        </div>
      </label>
      {rush && (
        <div className="rush-warning">
          Additional fee of <b>₱80.00</b> will be charged for priority delivery.
        </div>
      )}

      <button className="button" onClick={onPlace} disabled={placing}>
        {placing ? 'Placing…' : 'Place Order'}
      </button>
    </aside>
  );
};

export default CartPanel;
