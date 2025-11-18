export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPassword(password: string): boolean {
  // Minimum 8 characters
  return password.length >= 8;
}

export function validateRegisterInput(email: string, password: string): string | null {
  if (!email || !password) {
    return 'Email and password are required';
  }

  if (!isValidEmail(email)) {
    return 'Invalid email format';
  }

  if (!isValidPassword(password)) {
    return 'Password must be at least 8 characters long';
  }

  return null;
}

export function validateLoginInput(email: string, password: string): string | null {
  if (!email || !password) {
    return 'Email and password are required';
  }

  return null;
}
