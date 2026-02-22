import { User } from '@/store/auth/authTypes';

const API_URL = 'http://localhost:3001';

export async function loginRequest(
  email: string,
  password: string
): Promise<{ user: User; token: string }> {
  const response = await fetch(
    `${API_URL}/users?email=${email}&password=${password}`
  );

  const users = await response.json();

  if (!users.length) {
    throw new Error('Invalid credentials');
  }

  const { id, email: userEmail, role } = users[0];

  const user: User = {
    id,
    email: userEmail,
    role,
  };

  const token = btoa(`${userEmail}-${Date.now()}`);

  return { user, token };
}