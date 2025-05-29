
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  Token: string;
  "Login for: ": string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}
