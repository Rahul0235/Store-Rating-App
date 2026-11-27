import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../api';
import FormField from '../components/FormField';
import SortableTable from '../components/SortableTable';
import { formatRating } from '../format';
import { collectErrors, validateAddress, validateEmail, validateName } from '../validators';

function AddStoreForm({ onCreated, onCancel }) {
  const [form, setForm] = useState({ name: '', email: '', address: '', ownerEmail: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const found = collectErrors({
      name: validateName(form.name),
      email: validateEmail(form.email),
      address: validateAddress(form.address),
      ownerEmail: form.ownerEmail && validateEmail(form.ownerEmail),
    });
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    try {
      await api.post('/admin/stores', form);
      onCreated();
    } catch (err) {
      setServerError(getErrorMessage(err));
    }
  };

  return (
    <form className="panel" onSubmit={handleSubmit} noValidate>
      <h3>Add New Store</h3>
      {serverError && <div className="alert error-box">{serverError}</div>}
      <FormField label="Store Name" error={errors.name}>
        <input name="name" value={form.name} onChange={handleChange} />
      </FormField>
      <FormField label="Store Email" error={errors.email}>
        <input name="email" type="email" value={form.email} onChange={handleChange} />
      </FormField>
      <FormField label="Address" error={errors.address}>
        <textarea name="address" rows="2" value={form.address} onChange={handleChange} />
      </FormField>
      <FormField label="Owner Email (store owner account, optional)" error={errors.ownerEmail}>
        <input name="ownerEmail" type="email" value={form.ownerEmail} onChange={handleChange} />
      </FormField>
      <div className="actions">
        <button className="btn" type="submit">
          Create Store
        </button>
        <button className="btn secondary" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function AdminStores() {
  const emptyFilters = { name: '', email: '', address: '' };
  const [filters, setFilters] = useState(emptyFilters);
  const [stores, setStores] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  const loadStores = async (current = filters) => {
    try {
      const params = Object.fromEntries(Object.entries(current).filter(([, v]) => v));
      const { data } = await api.get('/admin/stores', { params });
      setStores(data);
      setError('');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  useEffect(() => {
    loadStores();
  }, []);

  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleSearch = (e) => {
    e.preventDefault();
    loadStores();
  };

  const handleReset = () => {
    setFilters(emptyFilters);
    loadStores(emptyFilters);
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'address', label: 'Address' },
    { key: 'rating', label: 'Rating', render: (s) => formatRating(s.rating) },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h2>Stores</h2>
        <button className="btn" onClick={() => setShowForm(true)}>
          + Add Store
        </button>
      </div>

      {showForm && (
        <AddStoreForm
          onCancel={() => setShowForm(false)}
          onCreated={() => {
            setShowForm(false);
            loadStores();
          }}
        />
      )}

      <form className="filters" onSubmit={handleSearch}>
        <input name="name" placeholder="Name" value={filters.name} onChange={handleFilterChange} />
        <input name="email" placeholder="Email" value={filters.email} onChange={handleFilterChange} />
        <input name="address" placeholder="Address" value={filters.address} onChange={handleFilterChange} />
        <button className="btn" type="submit">
          Filter
        </button>
        <button className="btn secondary" type="button" onClick={handleReset}>
          Reset
        </button>
      </form>

      {error && <div className="alert error-box">{error}</div>}
      <SortableTable columns={columns} rows={stores} initialSort="name" />
    </div>
  );
}
