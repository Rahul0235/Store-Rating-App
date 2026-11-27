import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../api';
import SortableTable from '../components/SortableTable';
import { formatRating } from '../format';

export default function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/owner/dashboard')
      .then((res) => setData(res.data))
      .catch((err) => setError(getErrorMessage(err)));
  }, []);

  const columns = [
    { key: 'name', label: 'User Name' },
    { key: 'email', label: 'Email' },
    { key: 'rating', label: 'Rating' },
  ];

  return (
    <div className="page">
      <h2>Dashboard</h2>
      {error && <div className="alert error-box">{error}</div>}

      {data && !data.storeName && (
        <div className="alert">No store has been assigned to your account yet.</div>
      )}

      {data && data.storeName && (
        <>
          <div className="cards">
            <div className="card">
              <h3>{formatRating(data.averageRating)}</h3>
              <p>Average rating for {data.storeName}</p>
            </div>
          </div>

          <h3>Users who rated your store</h3>
          <SortableTable columns={columns} rows={data.ratings} initialSort="name" />
        </>
      )}
    </div>
  );
}
