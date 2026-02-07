import { describe, it, expect, beforeEach } from "vitest";
import {
  generateFakeToken,
  decodeFakeToken,
  setAuthToken,
  getAuthToken,
  removeAuthToken,
} from "./auth";

describe("Auth Utils - Funções de Autenticação", () => {
  beforeEach(() => {
    // Limpa localStorage antes de cada teste
    localStorage.clear();
  });

  describe("generateFakeToken", () => {
    it("deve gerar um token válido em formato string", () => {
      const user = { id: 1, email: "test@test.com", role: "admin" };
      const token = generateFakeToken(user);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.length).toBeGreaterThan(0);
    });

    it("deve gerar tokens diferentes para usuários diferentes", () => {
      const user1 = { id: 1, email: "admin@test.com", role: "admin" };
      const user2 = { id: 2, email: "reader@test.com", role: "reader" };

      const token1 = generateFakeToken(user1);
      const token2 = generateFakeToken(user2);

      expect(token1).not.toBe(token2);
    });

    it("deve incluir informações do usuário no token", () => {
      const user = { id: 5, email: "user@test.com", role: "reader" };
      const token = generateFakeToken(user);

      // Decodifica o token para verificar conteúdo
      const decoded = decodeFakeToken(token);

      expect(decoded?.id).toBe(5);
      expect(decoded?.email).toBe("user@test.com");
      expect(decoded?.role).toBe("reader");
    });
  });

  describe("decodeFakeToken", () => {
    it("deve decodificar um token válido corretamente", () => {
      const user = { id: 1, email: "test@test.com", role: "admin" };
      const token = generateFakeToken(user);

      const decoded = decodeFakeToken(token);

      expect(decoded).toBeDefined();
      expect(decoded?.id).toBe(user.id);
      expect(decoded?.email).toBe(user.email);
      expect(decoded?.role).toBe(user.role);
    });

    it("deve retornar null para token inválido", () => {
      const decoded = decodeFakeToken("token-completamente-invalido");

      expect(decoded).toBeNull();
    });

    it("deve retornar null para string vazia", () => {
      const decoded = decodeFakeToken("");

      expect(decoded).toBeNull();
    });

    it("deve verificar expiração do token", () => {
      // Cria um token manualmente com data expirada
      const expiredPayload = {
        id: 1,
        email: "test@test.com",
        role: "admin",
        exp: Date.now() - 10000, // Expirado há 10 segundos
      };
      const expiredToken = btoa(JSON.stringify(expiredPayload));

      const decoded = decodeFakeToken(expiredToken);

      expect(decoded).toBeNull();
    });
  });

  describe("localStorage - Gerenciamento de Token", () => {
    it("deve salvar token no localStorage", () => {
      const token = "test-token-12345";
      setAuthToken(token);

      const savedToken = localStorage.getItem("token");
      expect(savedToken).toBe(token);
    });

    it("deve recuperar token salvo do localStorage", () => {
      const token = "test-token-67890";
      localStorage.setItem("token", token);

      const retrieved = getAuthToken();

      expect(retrieved).toBe(token);
    });

    it("deve retornar null quando não há token salvo", () => {
      const token = getAuthToken();

      expect(token).toBeNull();
    });

    it("deve remover token do localStorage", () => {
      localStorage.setItem("token", "token-to-be-removed");
      removeAuthToken();

      const token = localStorage.getItem("token");
      expect(token).toBeNull();
    });

    it("deve sobrescrever token existente ao salvar novo", () => {
      setAuthToken("old-token");
      setAuthToken("new-token");

      const token = getAuthToken();
      expect(token).toBe("new-token");
    });
  });
});
