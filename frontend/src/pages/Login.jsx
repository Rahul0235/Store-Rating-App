import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import api, { getErrorMessage } from '../api';
import { useAuth } from '../AuthContext';
import { homePath } from '../roles';
import FormField from '../components/FormField';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  if (user) return <Navigate to={homePath[user.role]} replace />;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/login', form);
      login(data);
      navigate(homePath[data.role]);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="auth-card">
      <h2>Login</h2>
      {error && <div className="alert error-box">{error}</div>}
      <form onSubmit={handleSubmit}>
        <FormField label="Email">
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </FormField>
        <FormField label="Password">
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
        </FormField>
        <button className="btn" type="submit">
          Login
        </button>
      </form>
      <p className="hint">
        New here? <Link to="/signup">Create an account</Link>
      </p>
    </div>
  );
}
