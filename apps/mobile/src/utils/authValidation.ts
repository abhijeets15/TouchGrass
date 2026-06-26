const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function validateEmail(email: string): string | null {
  const value = email.trim();
  if (!value) return 'Email is required';
  if (!EMAIL_RE.test(value)) return 'Enter a valid email address';
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Use at least 8 characters';
  return null;
}

export function validateDisplayName(name: string): string | null {
  const value = name.trim();
  if (!value) return 'Display name is required';
  if (value.length < 2) return 'Use at least 2 characters';
  if (value.length > 50) return 'Keep it under 50 characters';
  return null;
}

export function validateConfirmPassword(password: string, confirm: string): string | null {
  if (!confirm) return 'Confirm your password';
  if (password !== confirm) return 'Passwords do not match';
  return null;
}

export function passwordStrengthHint(password: string): string {
  if (password.length === 0) return 'At least 8 characters';
  if (password.length < 8) return `${8 - password.length} more character${password.length === 7 ? '' : 's'} needed`;
  return 'Looks good';
}
