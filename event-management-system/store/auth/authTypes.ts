export type UserRole = 'admin' | 'reader';

export interface User {
  id: number;
  email: string;
  role: UserRole;
}
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}