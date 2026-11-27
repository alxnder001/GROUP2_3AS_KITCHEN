import { useState, useEffect, useRef } from 'react';
import AdminLayout from '../components/AdminLayout';
import AdminPageHeader from '../components/AdminPageHeader';
import Alert from '../components/Alert';
import ProductTable from '../components/ProductTable';
import ProductModal from '../components/ProductModal';
import ConfirmModal from '../components/ConfirmModal';
import { api } from '../store/api';
import { M } from '../store/db';

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

const EMPTY = { id: null, name: '', description: '', price: '', cost: '', available: true, image: '', is_bundle: false };

export default function AdminProductsPage() {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [modal,   setModal]   = useState(false);
  const [rmId,    setRmId]    = useState(null);
  const [rmName,  setRmName]  = useState('');
  const [form,    setForm]    = useState(EMPTY);
  const [imgErr,  setImgErr]  = useState('');
  const [errors,  setErrors]  = useState({});
  const fileRef = useRef();

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/items');
      setItems((res.items || []).map(i => ({ ...i, is_bundle: !!i.is_bundle, available: !!i.available })));
    } catch (e) {
      setError(e.message || 'Failed to load products.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  function openAdd() {
    setForm(EMPTY); setErrors({}); setImgErr(''); setModal(true);
  }

  function openEdit(it) {
    setForm({
      id:          it.id,
      name:        it.name,
      description: it.description || '',
      price:       it.price,
      cost:        it.cost ?? '',
      available:   !!it.available,
      image:       it.image || '',
      is_bundle:   !!it.is_bundle,
    });
    setErrors({}); setImgErr(''); setModal(true);
  }

  function handleImg(e) {
    const file = e.target.files[0];
    readImage(file).then(src => {
      setForm(f => ({ ...f, image: src })); setImgErr('');
    }).catch(msg => setImgErr(msg));
  }

  async function handleSave() {
    const x = {};
    if (!form.name.trim())               x.pn = 'This field is required.';
    if (!(Number(form.price) > 0))       x.pp = 'Price must be greater than 0.';
    else if (!Number.isInteger(Number(form.price))) x.pp = 'Price must be a whole number.';
    else if (Number(form.price) > 9999)  x.pp = 'Price must not exceed 4 digits (9,999).';
    if (Number(form.cost) < 0)           x.pc = 'Cost cannot be negative.';
    else if (!Number.isInteger(Number(form.cost)))  x.pc = 'Cost must be a whole number.';
    else if (Number(form.cost) > 9999)   x.pc = 'Cost must not exceed 4 digits (9,999).';
    if (Object.keys(x).length) { setErrors(x); return; }

    const body = {
      name:        form.name.trim(),
      description: form.description,
      price:       Number(form.price),
      cost:        Number(form.cost) || 0,
      available:   form.available ? 1 : 0,
      image:       form.image,
      is_bundle:   form.is_bundle ? 1 : 0,
    };

    try {
      if (form.id) {
        await api.put(`/items/${form.id}`, body);
      } else {
        await api.post('/items', body);
      }
      setModal(false);
      await loadData();
    } catch (e) {
      setError(e.message || 'Failed to save product.');
    }
  }

  async function handleRemove() {
    try {
      await api.delete(`/items/${rmId}`);
      setRmId(null); setRmName('');
      await loadData();
    } catch (e) {
      setError(e.message || 'Failed to remove product.');
      setRmId(null); setRmName('');
    }
  }

  return (
    <AdminLayout>
      <AdminPageHeader title="Products" subtitle="Add, update, or remove dishes on the customer menu.">
        <button className="button" onClick={openAdd}>Add New Product</button>
      </AdminPageHeader>

      <Alert text={error} />

      <ProductTable
        items={items}
        loading={loading}
        M={M}
        onEdit={openEdit}
        onRemove={(id, name) => { setRmId(id); setRmName(name); }}
      />

      {modal && (
        <ProductModal
          form={form}
          setForm={setForm}
          errors={errors}
          imgErr={imgErr}
          fileRef={fileRef}
          onImg={handleImg}
          onClearImage={() => { setForm(f => ({ ...f, image: '' })); if (fileRef.current) fileRef.current.value = ''; }}
          onClose={() => setModal(false)}
          onSave={handleSave}
        />
      )}

      {rmId !== null && (
        <ConfirmModal
          title={`Remove "${rmName}"?`}
          message="It will no longer appear on the customer menu. Past orders keep their records and prices."
          confirmLabel="Yes, Remove"
          danger
          onClose={() => { setRmId(null); setRmName(''); }}
          onConfirm={handleRemove}
        />
      )}
    </AdminLayout>
  );
}
