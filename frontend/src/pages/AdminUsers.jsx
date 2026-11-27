import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../api';
import FormField from '../components/FormField';
import SortableTable from '../components/SortableTable';
import { formatRating } from '../format';
import { roleLabel } from '../roles';
import {
  collectErrors,
  validateAddress,
  validateEmail,
  validateName,
  validatePassword,
} from '../validators';

const emptyUser = { name: '', email: '', address: '', password: '', role: 'USER' };

function AddUserForm({ onCreated, onCancel }) {
  const [form, setForm] = useState(emptyUser);
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
      password: validatePassword(form.password),
    });
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    try {
      await api.post('/admin/users', form);
      onCreated();
    } catch (err) {
      setServerError(getErrorMessage(err));
    }
  };

  return (
    <form className="panel" onSubmit={handleSubmit} noValidate>
      <h3>Add New User</h3>
      {serverError && <div className="alert error-box">{serverError}</div>}
      <FormField label="Name" error={errors.name}>
        <input name="name" value={form.name} onChange={handleChange} />
      </FormField>
      <FormField label="Email" error={errors.email}>
        <input name="email" type="email" value={form.email} onChange={handleChange} />
      </FormField>
      <FormField label="Address" error={errors.address}>
        <textarea name="address" rows="2" value={form.address} onChange={handleChange} />
      </FormField>
      <FormField label="Password" error={errors.password}>
        <input name="password" type="password" value={form.password} onChange={handleChange} />
      </FormField>
      <FormField label="Role">
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="USER">Normal User</option>
          <option value="ADMIN">Admin</option>
          <option value="STORE_OWNER">Store Owner</option>
        </select>
      </FormField>
      <div className="actions">
        <button className="btn" type="submit">
          Create User
        </button>
        <button className="btn secondary" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function AdminUsers() {
  const emptyFilters = { name: '', email: '', address: '', role: '' };
  const [filters, setFilters] = useState(emptyFilters);
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  const loadUsers = async (current = filters) => {
    try {
      const params = Object.fromEntries(Object.entries(current).filter(([, v]) => v));
      const { data } = await api.get('/admin/users', { params });
      setUsers(data);
      setError('');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleSearch = (e) => {
    e.preventDefault();
    loadUsers();
  };

  const handleReset = () => {
    setFilters(emptyFilters);
    loadUsers(emptyFilters);
  };

  const viewDetails = async (id) => {
    try {
      const { data } = await api.get(`/admin/users/${id}`);
      setSelected(data);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'address', label: 'Address' },
    { key: 'role', label: 'Role', render: (u) => roleLabel[u.role] },
    {
      key: 'actions',
      label: '',
      sortable: false,
      render: (u) => (
        <button className="btn small" onClick={() => viewDetails(u.id)}>
          View
        </button>
      ),
    },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h2>Users</h2>
        <button className="btn" onClick={() => setShowForm(true)}>
          + Add User
        </button>
      </div>

      {showForm && (
        <AddUserForm
          onCancel={() => setShowForm(false)}
          onCreated={() => {
            setShowForm(false);
            loadUsers();
          }}
        />
      )}

      <form className="filters" onSubmit={handleSearch}>
        <input name="name" placeholder="Name" value={filters.name} onChange={handleFilterChange} />
        <input name="email" placeholder="Email" value={filters.email} onChange={handleFilterChange} />
        <input name="address" placeholder="Address" value={filters.address} onChange={handleFilterChange} />
        <select name="role" value={filters.role} onChange={handleFilterChange}>
          <option value="">All roles</option>
          <option value="ADMIN">Admin</option>
          <option value="USER">Normal User</option>
          <option value="STORE_OWNER">Store Owner</option>
        </select>
        <button className="btn" type="submit">
          Filter
        </button>
        <button className="btn secondary" type="button" onClick={handleReset}>
          Reset
        </button>
      </form>

      {error && <div className="alert error-box">{error}</div>}
      <SortableTable columns={columns} rows={users} initialSort="name" />

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>User Details</h3>
            <p><strong>Name:</strong> {selected.name}</p>
            <p><strong>Email:</strong> {selected.email}</p>
            <p><strong>Address:</strong> {selected.address}</p>
            <p><strong>Role:</strong> {roleLabel[selected.role]}</p>
            {selected.role === 'STORE_OWNER' && (
              <p><strong>Store Rating:</strong> {formatRating(selected.rating)}</p>
            )}
            <button className="btn secondary" onClick={() => setSelected(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
