import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, logout } from '../store/api';
import { flash, today } from '../store/db';
import CustomerLayout from '../components/CustomerLayout';
import PageIntro from '../components/PageIntro';
import Alert from '../components/Alert';
import ProductGrid from '../components/ProductGrid';
import CartPanel from '../components/CartPanel';
import '../styles/base.css';
import '../styles/menu.css';

export default function MenuPage() {
  const navigate = useNavigate();

  const name  = localStorage.getItem('3a_kitchen_name') || '';
  const email = localStorage.getItem('3a_kitchen_user') || '';
  const role  = localStorage.getItem('3a_kitchen_role') || '';

  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [filter,  setFilter]  = useState('all');

  // cart keys: "i-{id}"
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('3a_cart') || '{}'); }
    catch { return {}; }
  });

  const [barangay, setBarangay] = useState('');
  const [street,   setStreet]   = useState('');
  const [landmark, setLandmark] = useState('');
  const [contact,  setContact]  = useState('');
  const [notes,    setNotes]    = useState('');
  const [date,     setDate]     = useState('');
  const [time,     setTime]     = useState('');
  const [rush,     setRush]     = useState(false);
  const [promo,    setPromo]    = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState('');
  const [errors,   setErrors]   = useState({});
  const [placing,  setPlacing]  = useState(false);

  useEffect(() => {
    if (!email || role !== 'c') navigate('/login', { replace: true });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLoading(true);
    api.get('/items')
      .then(data => {
        const list = Array.isArray(data) ? data : (data.items || []);
        // normalize MySQL 0/1 integers to booleans
        const normalized = list.map(i => ({
          ...i,
          is_bundle: !!i.is_bundle,
          available: !!i.available,
          deleted:   !!i.deleted,
        }));
        setItems(normalized);
        // clean cart: remove deleted/unavailable items
        setCart(prev => {
          const clean = {};
          Object.entries(prev).forEach(([key, qty]) => {
            const it = normalized.find(x => x.id == key.slice(2));
            if (it && it.available && !it.deleted) clean[key] = qty;
          });
          return clean;
        });
      })
      .catch(err => setError(err.message || 'Failed to load menu.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    sessionStorage.setItem('3a_cart', JSON.stringify(cart));
  }, [cart]);

  const addCart = (key) => setCart(c => ({ ...c, [key]: (c[key] || 0) + 1 }));
  const decCart = (key) => setCart(c => {
    const next = { ...c, [key]: (c[key] || 1) - 1 };
    if (next[key] < 1) delete next[key];
    return next;
  });

  const resolveCart = (key) => {
    const it = items.find(x => x.id == key.slice(2));
    return it ? { name: it.name, price: Number(it.price) } : { name: '', price: 0 };
  };

  const subtotal    = Object.entries(cart).reduce((t, [key, qty]) => t + resolveCart(key).price * qty, 0);
  const DELIVERY_FEES = {
    'Puting Bato East':  30,
    'Puting Bato West':  35,
    'Sinisian East':     30,
    'Dila':              45,
    'Caluangan':         50,
    'Sinisian West':     50,
    'Baclas':            60,
    'Coral ni Bacal':    60,
  };

  const fee         = subtotal > 0 ? (DELIVERY_FEES[barangay] ?? 0) : 0;
  const rushFee     = rush ? 80 : 0;
  const total       = subtotal - discount + fee + rushFee;
  const cartEntries = Object.entries(cart);
  const cartCount   = cartEntries.reduce((t, [, qty]) => t + qty, 0);

  const [cartOpen, setCartOpen] = useState(false);

  function handleCartClick() { setCartOpen(o => !o); }

  const onAdd = id => {
    addCart(`i-${id}`);
    setErrors(e => ({ ...e, cart: '' }));
  };

  const onPromoChange = e => {
    setPromo(e.target.value);
    setErrors(x => ({ ...x, pc: '' }));
    if (promoApplied && e.target.value.trim().toUpperCase() !== promoApplied) {
      setDiscount(0); setPromoApplied('');
    }
  };

  async function applyPromo() {
    const code = promo.trim().toUpperCase();
    if (!code) return;
    try {
      const res = await api.post('/promos/validate', { code, subtotal });
      setDiscount(res.discount || 0);
      setPromoApplied(code);
      setErrors(x => ({ ...x, pc: '' }));
    } catch (err) {
      setDiscount(0);
      setPromoApplied('');
      setErrors(x => ({ ...x, pc: err.message || 'Invalid promo code.' }));
    }
  }

  async function handlePlace() {
    const x = {};
    if (subtotal === 0) {
      x.cart = 'Your cart is empty. Add items from the menu to place an order.';
    } else {
      if (!barangay)        x.addr    = 'Please select a barangay.';
      if (!street.trim())   x.street  = 'This field is required.';
      if (!contact.trim())  x.contact = 'This field is required.';
      else if (!/^[0-9]{11}$/.test(contact.trim())) x.contact = 'Contact number must be exactly 11 digits.';
      if (!date)        x.date = 'This field is required.';
      else if (date < today) x.date = 'Choose today or a later date.';
      if (date && !time)    x.time = 'Please select a preferred time.';
    }
    if (Object.keys(x).length) { setErrors(x); return; }

    setPlacing(true);
    try {
      const orderItems = Object.entries(cart).map(([key, quantity]) => ({
        item_id:   Number(key.slice(2)),
        quantity,
        is_bundle: false,
      }));

      // Build structured address string
      const addrParts = [
        `Barangay: ${barangay}`,
        `Purok/Street: ${street.trim()}`,
        landmark.trim() ? `Landmark: ${landmark.trim()}` : null,
        `Contact: ${contact.trim()}`,
        time ? `Preferred time: ${time}` : null,
        notes.trim() ? `Notes: ${notes.trim()}` : null,
      ].filter(Boolean).join(' | ');

      const body = { address: addrParts, want_date: date, is_rush: rush ? 1 : 0, items: orderItems };
      const code = promo.trim().toUpperCase();
      if (code) body.promo_code = code;

      const data = await api.post('/orders', body);
      const newOrderId = data.orderId || data.message;
      sessionStorage.removeItem('3a_cart');
      sessionStorage.setItem('3a_open', newOrderId);
      flash(`Order #${newOrderId} placed! Please prepare cash for the rider.`);
      setTime('');
      setCartOpen(false);
      navigate('/orders');
    } catch (err) {
      const msg = err.message || 'Failed to place order.';
      if (msg.toLowerCase().includes('promo') || msg.toLowerCase().includes('code')) {
        setErrors(x => ({ ...x, pc: msg }));
      } else {
        setErrors(x => ({ ...x, general: msg }));
      }
    } finally {
      setPlacing(false);
    }
  }

  async function handleLogout() { await logout(); navigate('/login', { replace: true }); }

  return (
    <CustomerLayout active="menu" name={name} onLogout={handleLogout} cartCount={cartCount} onCartClick={handleCartClick}>
      <PageIntro title="Our Menu" subtitle="Browse and order from our available products." />
      <Alert text={error} />

      <div className="menu-main">
        <ProductGrid
          filter={filter}
          setFilter={setFilter}
          items={items}
          loading={loading}
          onAdd={onAdd}
        />
      </div>

      {/* Cart drawer overlay */}
      {cartOpen && (
        <div className="cart-overlay" onClick={() => setCartOpen(false)} />
      )}
      <div className={`cart-drawer${cartOpen ? ' open' : ''}`}>
        <button className="cart-drawer-close" onClick={() => setCartOpen(false)} aria-label="Close cart">✕</button>
        <CartPanel
          cartEntries={cartEntries}
          resolveCart={resolveCart}
          subtotal={subtotal}
          fee={fee}
          rushFee={rushFee}
          total={total}
          discount={discount}
          promo={promo}
          promoApplied={promoApplied}
          errors={errors}
          setErrors={setErrors}
          barangay={barangay}
          setBarangay={setBarangay}
          street={street}
          setStreet={setStreet}
          landmark={landmark}
          setLandmark={setLandmark}
          contact={contact}
          setContact={setContact}
          notes={notes}
          setNotes={setNotes}
          date={date}
          setDate={setDate}
          time={time}
          setTime={setTime}
          rush={rush}
          setRush={setRush}
          today={today}
          placing={placing}
          addCart={addCart}
          decCart={decCart}
          applyPromo={applyPromo}
          onPromoChange={onPromoChange}
          onPlace={handlePlace}
        />
      </div>
    </CustomerLayout>
  );
}
