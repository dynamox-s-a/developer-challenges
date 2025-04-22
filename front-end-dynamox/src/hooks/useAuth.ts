import { useContext } from 'react';
import { AuthContext } from '../context/AuthContextValue';

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside the AuthProvider');
  }

  return context;
}
