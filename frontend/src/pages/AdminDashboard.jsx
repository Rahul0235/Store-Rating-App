import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/admin/stats')
      .then(({ data }) => setStats(data))
      .catch((err) => setError(getErrorMessage(err)));
  }, []);

  return (
    <div className="page">
      <h2>Dashboard</h2>
      {error && <div className="alert error-box">{error}</div>}
      {stats && (
        <div className="cards">
          <div className="card">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
          <div className="card">
            <h3>{stats.totalStores}</h3>
            <p>Total Stores</p>
          </div>
          <div className="card">
            <h3>{stats.totalRatings}</h3>
            <p>Total Ratings</p>
          </div>
        </div>
      )}
    </div>
  );
}
