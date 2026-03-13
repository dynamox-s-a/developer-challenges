'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { User } from "@/types/event";
import api from "@/lib/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser utilizado dentro do AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("auth_token");
    const savedUser = localStorage.getItem("auth_user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }

    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await api.get(`/users`, {
        params: { email },
      });

      const found = res.data[0];

      if (!found || found.password !== password) {
        return { success: false, error: "Email ou senha inválidos" };
      }

      const fakeToken = `fake-jwt-${found.id}-${Date.now()}`;

      const { password: _, ...userData } = found;

      setUser(userData);
      setToken(fakeToken);

      localStorage.setItem("auth_token", fakeToken);
      localStorage.setItem("auth_user", JSON.stringify(userData));

      return { success: true };
    } catch (err) {
      return { success: false, error: "Erro no servidor" };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};