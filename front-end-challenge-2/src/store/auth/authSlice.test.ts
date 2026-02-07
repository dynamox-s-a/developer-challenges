import { describe, it, expect } from "vitest";
import authReducer, { logout, clearError } from "./authSlice";

describe("AuthSlice - Redux de Autenticação", () => {
  const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  };

  it("deve retornar o estado inicial quando não há ação", () => {
    const state = authReducer(undefined, { type: "unknown" });

    expect(state).toEqual(initialState);
  });

  describe("logout", () => {
    it("deve limpar completamente o estado do usuário", () => {
      const authenticatedState = {
        user: {
          id: 1,
          email: "admin@events.com",
          role: "admin" as const,
          name: "Administrador",
          password: "admin123",
        },
        token: "fake-jwt-token-12345",
        isAuthenticated: true,
        loading: false,
        error: null,
      };

      const newState = authReducer(authenticatedState, logout());

      expect(newState.user).toBeNull();
      expect(newState.token).toBeNull();
      expect(newState.isAuthenticated).toBe(false);
      expect(newState.error).toBeNull();
    });

    it("deve funcionar mesmo quando já está deslogado", () => {
      const newState = authReducer(initialState, logout());

      expect(newState).toEqual(initialState);
    });
  });

  describe("clearError", () => {
    it("deve remover mensagem de erro mantendo resto do estado", () => {
      const stateWithError = {
        ...initialState,
        error: "Credenciais inválidas",
      };

      const newState = authReducer(stateWithError, clearError());

      expect(newState.error).toBeNull();
      expect(newState.user).toBeNull();
      expect(newState.isAuthenticated).toBe(false);
    });

    it("deve funcionar quando não há erro", () => {
      const newState = authReducer(initialState, clearError());

      expect(newState.error).toBeNull();
    });

    it("não deve afetar estado de autenticação ao limpar erro", () => {
      const authenticatedStateWithError = {
        user: {
          id: 2,
          email: "reader@events.com",
          role: "reader" as const,
          name: "Leitor",
          password: "reader123",
        },
        token: "reader-token",
        isAuthenticated: true,
        loading: false,
        error: "Algum erro anterior",
      };

      const newState = authReducer(authenticatedStateWithError, clearError());

      expect(newState.error).toBeNull();
      expect(newState.user).toBeDefined();
      expect(newState.isAuthenticated).toBe(true);
      expect(newState.token).toBe("reader-token");
    });
  });
});
