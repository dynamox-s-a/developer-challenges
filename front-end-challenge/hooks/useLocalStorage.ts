"use client";

import { useState } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // Estado para armazenar o valor atual
  const [storedValue, setStoredValue] = useState<T>(() => {
    // Evita erro durante SSR verificando se window existe
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Erro ao ler localStorage para a chave "${key}":`, error);
      return initialValue;
    }
  });

  // Função para definir valor no localStorage e no estado
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permite que o valor seja uma função, como useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);

      // Salva no localStorage apenas no cliente
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(
        `Erro ao definir localStorage para a chave "${key}":`,
        error
      );
    }
  };

  // Função para remover valor do localStorage
  const removeValue = () => {
    try {
      setStoredValue(initialValue);

      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(
        `Erro ao remover localStorage para a chave "${key}":`,
        error
      );
    }
  };

  return [storedValue, setValue, removeValue];
}
