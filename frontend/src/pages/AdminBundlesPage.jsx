import { useState, useEffect, useRef } from 'react';
import AdminLayout from '../components/AdminLayout';
import AdminPageHeader from '../components/AdminPageHeader';
import Alert from '../components/Alert';
import BundleTable from '../components/BundleTable';
import BundleModal from '../components/BundleModal';
import ConfirmModal from '../components/ConfirmModal';
import { api } from '../store/api';

function readImage(file, max = 800) {
  return new Promise((ok, no) => {
    if (!file || !/^image\//.test(file.type)) return no('Please choose an image file (JPG, PNG or WebP).');
    const r = new FileReader();
    r.onerror = () => no('That file could not be read.');
    r.onload  = () => {
      const im = new Image();
      im.onerror = () => no('That file could not be read as an image.');
      im.onload  = () => {
        const k = Math.min(1, max / Math.max(im.width, im.height));
        const c = document.createElement('canvas');
        c.width  = Math.round(im.width  * k);
        c.height = Math.round(im.height * k);
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
        ok(c.toDataURL('image/jpeg', 0.85));
      };
      im.src = r.result;
    };
    r.readAsDataURL(file);
  });
}

const EMPTY = { id: null, name: '', description: '', price: '', available: true, image: '', items: [] };

export default function AdminBundlesPage() {
  const [bundles,  setBundles]  = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [modal,    setModal]    = useState(false);
  const [rmId,     setRmId]     = useState(null);
  const [form,     setForm]     = useState(EMPTY);
  const [imgErr,   setImgErr]   = useState('');
  const [errors,   setErrors]   = useState({});
  const fileRef = useRef();

  async function loadData() {
    setLoading(true); setError('');
    try {
      const [bRes, iRes] = await Promise.all([
        api.get('/bundles'),
        api.get('/items'),
      ]);
      setBundles(bRes.bundles || bRes);
      setAllItems(iRes.items || iRes);
    } catch(e) {
      setError(e.message || 'Failed to load bundles.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  function openAdd() {
    setForm(EMPTY); setErrors({}); setImgErr(''); setModal(true);
  }

  function openEdit(b) {
    setForm({
      id: b.id, name: b.name, description: b.description || '',
      price: b.price, available: !!b.available, image: b.image || '',
      items: (b.items || []).map(i => ({ item_id: i.item_id, quantity: i.quantity })),
    });
    setErrors({}); setImgErr(''); setModal(true);
  }

  function handleImg(e) {
    readImage(e.target.files[0])
      .then(src => { setForm(f => ({ ...f, image: src })); setImgErr(''); })
      .catch(msg => setImgErr(msg));
  }

  function addBundleItem() {
    if (!allItems.length) return;
    setForm(f => ({ ...f, items: [...f.items, { item_id: allItems[0].id, quantity: 1 }] }));
  }

  function updateBundleItem(idx, key, val) {
    setForm(f => {
      const items = [...f.items];
      items[idx] = { ...items[idx], [key]: key === 'quantity' ? Math.max(1, Number(val)) : Number(val) };
      return { ...f, items };
    });
  }

  function removeBundleItem(idx) {
    setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));
  }

  async function handleSave() {
    const x = {};
    if (!form.name.trim())        x.name  = 'Bundle name is required.';
    if (!(Number(form.price) > 0)) x.price = 'Price must be greater than 0.';
    if (!form.items.length)       x.items = 'Add at least one product to the bundle.';
    if (Object.keys(x).length) { setErrors(x); return; }

    const payload = {
      name: form.name.trim(), description: form.description,
      price: Number(form.price), available: form.available,
      image: form.image, items: form.items,
    };

    try {
      if (form.id) {
        await api.put(`/bundles/${form.id}`, payload);
      } else {
        await api.post('/bundles', payload);
      }
      setModal(false); loadData();
    } catch(e) {
      setErrors({ name: e.message || 'Failed to save bundle.' });
    }
  }

  async function handleRemove() {
    try {
      await api.delete(`/bundles/${rmId}`);
      setRmId(null); loadData();
    } catch(e) {
      setError(e.message || 'Failed to remove bundle.');
      setRmId(null);
    }
  }

  const getItemName = id => {
    const it = allItems.find(x => x.id == id);
    return it ? it.name : `Item #${id}`;
  };

  return (
    <AdminLayout>
      <AdminPageHeader title="Bundles" subtitle="Create packages made up of individual products.">
        <button className="button" onClick={openAdd}>Add New Bundle</button>
      </AdminPageHeader>

      <Alert text={error} />

      {loading ? (
        <p className="muted">Loading bundles…</p>
      ) : (
        <BundleTable
          bundles={bundles}
          getItemName={getItemName}
          onEdit={openEdit}
          onRemove={id => setRmId(id)}
        />
      )}

      {modal && (
        <BundleModal
          form={form}
          setForm={setForm}
          errors={errors}
          imgErr={imgErr}
          fileRef={fileRef}
          allItems={allItems}
          onAddItem={addBundleItem}
          onUpdateItem={updateBundleItem}
          onRemoveItem={removeBundleItem}
          onImg={handleImg}
          onClearImage={() => { setForm(f => ({ ...f, image: '' })); if (fileRef.current) fileRef.current.value = ''; }}
          onClose={() => setModal(false)}
          onSave={handleSave}
        />
      )}

      {rmId !== null && (
        <ConfirmModal
          title={`Remove "${bundles.find(b => b.id === rmId)?.name}"?`}
          message="It will no longer appear on the customer menu. Past orders keep their records."
          confirmLabel="Yes, Remove"
          danger
          onClose={() => setRmId(null)}
          onConfirm={handleRemove}
        />
      )}
    </AdminLayout>
  );
}
