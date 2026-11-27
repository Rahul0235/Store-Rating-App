import { useState } from 'react';
import api, { getErrorMessage } from '../api';
import FormField from '../components/FormField';
import { validatePassword } from '../validators';

export default function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setServerError('');

    const found = {};
    if (!form.currentPassword) found.currentPassword = 'Current password is required';
    const passwordError = validatePassword(form.newPassword);
    if (passwordError) found.newPassword = passwordError;
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    try {
      const { data } = await api.put('/auth/password', form);
      setMessage(data.message);
      setForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setServerError(getErrorMessage(err));
    }
  };

  return (
    <div className="page narrow">
      <h2>Change Password</h2>
      {message && <div className="alert success-box">{message}</div>}
      {serverError && <div className="alert error-box">{serverError}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <FormField label="Current Password" error={errors.currentPassword}>
          <input name="currentPassword" type="password" value={form.currentPassword} onChange={handleChange} />
        </FormField>
        <FormField label="New Password" error={errors.newPassword}>
          <input name="newPassword" type="password" value={form.newPassword} onChange={handleChange} />
        </FormField>
        <button className="btn" type="submit">
          Update Password
        </button>
      </form>
    </div>
  );
}
