"use client";

import { useState } from "react";
import { authStorage } from "../utils";

export function useLocalStorage(): [
  string | null,
  (token: string) => void,
  () => void
] {
  const [token, setToken] = useState<string | null>(() => {
    return authStorage.getToken();
  });

  const saveToken = (newToken: string) => {
    setToken(newToken);
    authStorage.setToken(newToken);
  };

  const removeToken = () => {
    setToken(null);
    authStorage.removeToken();
  };

  return [token, saveToken, removeToken];
}
