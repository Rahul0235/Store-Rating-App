import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { getErrorMessage } from '../api';
import FormField from '../components/FormField';
import {
  collectErrors,
  validateAddress,
  validateEmail,
  validateName,
  validatePassword,
} from '../validators';

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '' });
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
      await api.post('/auth/signup', form);
      navigate('/login');
    } catch (err) {
      setServerError(getErrorMessage(err));
    }
  };

  return (
    <div className="auth-card">
      <h2>Sign Up</h2>
      {serverError && <div className="alert error-box">{serverError}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <FormField label="Name" error={errors.name}>
          <input name="name" value={form.name} onChange={handleChange} />
        </FormField>
        <FormField label="Email" error={errors.email}>
          <input name="email" type="email" value={form.email} onChange={handleChange} />
        </FormField>
        <FormField label="Address" error={errors.address}>
          <textarea name="address" rows="3" value={form.address} onChange={handleChange} />
        </FormField>
        <FormField label="Password" error={errors.password}>
          <input name="password" type="password" value={form.password} onChange={handleChange} />
        </FormField>
        <button className="btn" type="submit">
          Register
        </button>
      </form>
      <p className="hint">
        Already registered? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
