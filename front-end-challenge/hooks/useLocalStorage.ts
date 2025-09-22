"use client";

import { useState } from "react";

export function useLocalStorage(): [
  string | null,
  (token: string) => void,
  () => void
] {
  const key = "jwt_token";

  const [token, setToken] = useState<string | null>(() => {
    // Evita erro durante SSR verificando se window existe
    if (typeof window === "undefined") {
      return null;
    }

    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      console.error("Erro ao ler token do localStorage:", error);
      return null;
    }
  });

  const saveToken = (newToken: string) => {
    try {
      setToken(newToken);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, newToken);
      }
    } catch (error) {
      console.error("Erro ao salvar token no localStorage:", error);
    }
  };

  const removeToken = () => {
    try {
      setToken(null);

      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error("Erro ao remover token do localStorage:", error);
    }
  };

  return [token, saveToken, removeToken];
}
