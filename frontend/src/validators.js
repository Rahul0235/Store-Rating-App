const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const PASSWORD_RE = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

export const validateName = (value) =>
  value.length < 20 || value.length > 60 ? 'Name must be between 20 and 60 characters' : '';

export const validateEmail = (value) =>
  EMAIL_RE.test(value) ? '' : 'Enter a valid email address';

export const validateAddress = (value) => {
  if (!value.trim()) return 'Address is required';
  if (value.length > 400) return 'Address can be at most 400 characters';
  return '';
};

export const validatePassword = (value) =>
  PASSWORD_RE.test(value)
    ? ''
    : 'Password must be 8-16 characters with at least one uppercase letter and one special character';

// keeps only the fields that actually have an error
export function collectErrors(checks) {
  const errors = {};
  Object.entries(checks).forEach(([field, message]) => {
    if (message) errors[field] = message;
  });
  return errors;
}
