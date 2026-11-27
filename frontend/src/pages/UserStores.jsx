import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../api';
import SortableTable from '../components/SortableTable';
import { formatRating } from '../format';

function RatingAction({ store, onSaved, onError }) {
  const [value, setValue] = useState(store.userRating ?? '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!value) return;
    setSaving(true);
    try {
      await api.post(`/stores/${store.id}/rating`, { rating: Number(value) });
      onSaved();
    } catch (err) {
      onError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rating-action">
      <select value={value} onChange={(e) => setValue(e.target.value)}>
        <option value="">Select</option>
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
      <button className="btn small" onClick={handleSubmit} disabled={!value || saving}>
        {store.userRating ? 'Modify' : 'Submit'}
      </button>
    </div>
  );
}

export default function UserStores() {
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [stores, setStores] = useState([]);
  const [error, setError] = useState('');

  const loadStores = async (current = filters) => {
    try {
      const params = Object.fromEntries(Object.entries(current).filter(([, v]) => v));
      const { data } = await api.get('/stores', { params });
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
    const cleared = { name: '', address: '' };
    setFilters(cleared);
    loadStores(cleared);
  };

  const columns = [
    { key: 'name', label: 'Store Name' },
    { key: 'address', label: 'Address' },
    { key: 'overallRating', label: 'Overall Rating', render: (s) => formatRating(s.overallRating) },
    {
      key: 'userRating',
      label: 'Your Rating',
      render: (s) => (s.userRating ? s.userRating : 'Not rated'),
    },
    {
      key: 'action',
      label: 'Rate',
      sortable: false,
      render: (s) => <RatingAction store={s} onSaved={() => loadStores()} onError={setError} />,
    },
  ];

  return (
    <div className="page">
      <h2>Stores</h2>

      <form className="filters" onSubmit={handleSearch}>
        <input name="name" placeholder="Search by name" value={filters.name} onChange={handleFilterChange} />
        <input name="address" placeholder="Search by address" value={filters.address} onChange={handleFilterChange} />
        <button className="btn" type="submit">
          Search
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
