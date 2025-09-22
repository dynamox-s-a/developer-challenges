"use client";

import { useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  generateFakeJWT,
  decodeFakeJWT,
  isValidFakeJWT,
} from "@/lib/auth/jwt-fake";
import { authenticateUser, setAuthToken } from "@/lib/api/apiClients";
import type { AuthUser, LoginFormCredentials } from "@/types";

export function useAuth() {
  const [token, saveToken, removeToken] = useLocalStorage();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Verifica token ao carregar
  useEffect(() => {
    if (token && isValidFakeJWT(token)) {
      const payload = decodeFakeJWT(token);
      if (payload) {
        setUser({
          userId: payload.userId,
          email: payload.email,
          role: payload.role,
        });
        // Define o token no cliente API
        setAuthToken(token);
      } else {
        // Token inválido ou expirado
        removeToken();
        setUser(null);
        setAuthToken(null);
      }
    } else if (!token) {
      // Se não há token, garante que user é null
      setUser(null);
      setAuthToken(null);
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]); // removeToken é estável do useLocalStorage

  /**
   * Autentica o usuário através da API
   * @param credentials - Email e senha
   * @returns Promise<{ success: boolean, redirectTo?: string }>
   */
  const login = async (
    credentials: LoginFormCredentials
  ): Promise<{
    success: boolean;
    redirectTo?: string;
    error?: string;
  }> => {
    setLoading(true);

    try {
      // Autentica através da API
      const authenticatedUser = await authenticateUser({
        email: credentials.username,
        password: credentials.password,
      });

      if (authenticatedUser) {
        // Gera JWT fake com dados do usuário da API
        const fakeToken = generateFakeJWT({
          email: authenticatedUser.email,
          role: authenticatedUser.role,
        });

        // Salva no localStorage
        saveToken(fakeToken);

        // Atualiza estado do usuário
        const payload = decodeFakeJWT(fakeToken);
        if (payload) {
          setUser({
            userId: payload.userId,
            email: payload.email,
            role: payload.role,
          });

          // Define o token no cliente API
          setAuthToken(fakeToken);

          // Determina redirecionamento baseado na role
          const redirectTo =
            authenticatedUser.role === "admin" ? "/admin" : "/dashboard";

          setLoading(false);
          return { success: true, redirectTo };
        }
      }

      setLoading(false);
      return {
        success: false,
        error: "Credenciais inválidas. Verifique email e senha.",
      };
    } catch (error) {
      console.error("Erro durante autenticação:", error);
      setLoading(false);
      return {
        success: false,
        error: "Erro de conexão. Verifique se a API está rodando.",
      };
    }
  };

  /**
   * Faz logout do usuário
   */
  const logout = () => {
    removeToken();
    setUser(null);
    setAuthToken(null);
  };

  /**
   * Verifica se o usuário está autenticado
   */
  const isAuthenticated = !!user && !!token && isValidFakeJWT(token);

  /**
   * Verifica se o usuário tem role de admin
   */
  const isAdmin = user?.role === "admin";

  /**
   * Obtém a rota de redirecionamento baseada na role do usuário
   */
  const getRedirectRoute = () => {
    if (!user) return "/";
    return user.role === "admin" ? "/admin" : "/dashboard";
  };

  return {
    user,
    token,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    getRedirectRoute,
  };
}
