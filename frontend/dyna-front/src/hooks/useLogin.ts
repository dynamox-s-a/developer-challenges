
import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { LoginCredentials, LoginResponse, User } from '../types/auth.types';

interface UseLoginReturn {
  loading: boolean;
  error: string | null;
  handleLogin: (credentials: LoginCredentials) => Promise<void>;
  clearError: () => void;
}

export const useLogin = (): UseLoginReturn => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (credentials: LoginCredentials): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post<LoginResponse>(
        'http://localhost:3000/auth/login',
        credentials
      );

      const token = response.data.Token;
      const userName = response.data["Login for: "];

      const user: User = {
        id: 1,
        name: userName,
        email: credentials.email,
      };

      login(token, user);
    } catch (err: unknown) {
      console.error('Erro no login:', err);
      
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message || 
          'Erro ao fazer login. Verifique suas credenciais.'
        );
      } else {
        setError('Erro inesperado. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  return {
    loading,
    error,
    handleLogin,
    clearError,
  };
};
