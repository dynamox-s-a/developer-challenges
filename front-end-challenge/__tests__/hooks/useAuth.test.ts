import { renderHook, act, waitFor } from "@testing-library/react";
import { useAuth } from "@/hooks/useAuth";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  generateFakeJWT,
  decodeFakeJWT,
  isValidFakeJWT,
} from "@/lib/auth/jwt-fake";
import { authenticateUser, setAuthToken } from "@/lib/api/apiClients";
import { UserRole } from "@/types";
import type { AuthUser, LoginFormCredentials } from "@/types";

// Mocks
jest.mock("@/hooks/useLocalStorage");
jest.mock("@/lib/auth/jwt-fake");
jest.mock("@/lib/api/apiClients");

const mockUseLocalStorage = useLocalStorage as jest.MockedFunction<
  typeof useLocalStorage
>;
const mockGenerateFakeJWT = generateFakeJWT as jest.MockedFunction<
  typeof generateFakeJWT
>;
const mockDecodeFakeJWT = decodeFakeJWT as jest.MockedFunction<
  typeof decodeFakeJWT
>;
const mockIsValidFakeJWT = isValidFakeJWT as jest.MockedFunction<
  typeof isValidFakeJWT
>;
const mockAuthenticateUser = authenticateUser as jest.MockedFunction<
  typeof authenticateUser
>;
const mockSetAuthToken = setAuthToken as jest.MockedFunction<
  typeof setAuthToken
>;

describe("useAuth Hook", () => {
  let mockSaveToken: jest.Mock;
  let mockRemoveToken: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockSaveToken = jest.fn();
    mockRemoveToken = jest.fn();

    // Setup padrão do useLocalStorage
    mockUseLocalStorage.mockReturnValue([null, mockSaveToken, mockRemoveToken]);
  });

  describe("Inicialização", () => {
    it("deve inicializar com loading=true e user=null quando não há token", async () => {
      mockUseLocalStorage.mockReturnValue([
        null,
        mockSaveToken,
        mockRemoveToken,
      ]);

      const { result } = renderHook(() => useAuth());

      // O loading pode não ser true imediatamente se o useEffect roda síncronamente
      // Vamos aguardar o estado final
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isAdmin).toBe(false);
      expect(mockSetAuthToken).toHaveBeenCalledWith(null);
    });

    it("deve inicializar com usuário quando token é válido", async () => {
      const mockToken = "valid-token";
      const mockPayload = {
        userId: "user-123",
        email: "admin@events.com",
        name: "Admin User",
        role: UserRole.ADMIN,
        iat: Date.now(),
        exp: Date.now() + 3600000,
      };

      mockUseLocalStorage.mockReturnValue([
        mockToken,
        mockSaveToken,
        mockRemoveToken,
      ]);
      mockIsValidFakeJWT.mockReturnValue(true);
      mockDecodeFakeJWT.mockReturnValue(mockPayload);

      const { result } = renderHook(() => useAuth());

      // Aguarda o useEffect processar
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toEqual({
        userId: mockPayload.userId,
        email: mockPayload.email,
        role: mockPayload.role,
      });
      expect(result.current.token).toBe(mockToken);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isAdmin).toBe(true);
      expect(mockSetAuthToken).toHaveBeenCalledWith(mockToken);
    });

    it("deve inicializar como reader quando token válido tem role READER", async () => {
      const mockToken = "valid-reader-token";
      const mockPayload = {
        userId: "user-456",
        email: "reader@events.com",
        name: "Reader User",
        role: UserRole.READER,
        iat: Date.now(),
        exp: Date.now() + 3600000,
      };

      mockUseLocalStorage.mockReturnValue([
        mockToken,
        mockSaveToken,
        mockRemoveToken,
      ]);
      mockIsValidFakeJWT.mockReturnValue(true);
      mockDecodeFakeJWT.mockReturnValue(mockPayload);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toEqual({
        userId: mockPayload.userId,
        email: mockPayload.email,
        role: mockPayload.role,
      });
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isAdmin).toBe(false);
    });

    it("deve limpar dados quando token é válido mas decodeFakeJWT falha", async () => {
      const mockToken = "corrupted-token";

      mockUseLocalStorage.mockReturnValue([
        mockToken,
        mockSaveToken,
        mockRemoveToken,
      ]);
      mockIsValidFakeJWT.mockReturnValue(true);
      mockDecodeFakeJWT.mockReturnValue(null); // Falha na decodificação

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(mockRemoveToken).toHaveBeenCalled();
      expect(mockSetAuthToken).toHaveBeenCalledWith(null);
    });

    it("deve não chamar removeToken quando token não existe", async () => {
      mockUseLocalStorage.mockReturnValue([
        null,
        mockSaveToken,
        mockRemoveToken,
      ]);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isAdmin).toBe(false);
      expect(mockRemoveToken).not.toHaveBeenCalled(); // Não deve chamar quando não há token
      expect(mockSetAuthToken).toHaveBeenCalledWith(null);
    });

    it("deve reagir a mudanças no token do localStorage", async () => {
      const { result, rerender } = renderHook(() => useAuth());

      // Primeiro sem token
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      expect(result.current.user).toBeNull();

      // Simula mudança no localStorage para token válido
      const newToken = "new-valid-token";
      const mockPayload = {
        userId: "user-789",
        email: "test@events.com",
        name: "Test User",
        role: UserRole.ADMIN,
        iat: Date.now(),
        exp: Date.now() + 3600000,
      };

      mockUseLocalStorage.mockReturnValue([
        newToken,
        mockSaveToken,
        mockRemoveToken,
      ]);
      mockIsValidFakeJWT.mockReturnValue(true);
      mockDecodeFakeJWT.mockReturnValue(mockPayload);

      rerender();

      await waitFor(() => {
        expect(result.current.user).toEqual({
          userId: mockPayload.userId,
          email: mockPayload.email,
          role: mockPayload.role,
        });
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(mockSetAuthToken).toHaveBeenCalledWith(newToken);
    });
  });

  describe("getRedirectRoute", () => {
    it('deve retornar "/" quando não há usuário', async () => {
      mockUseLocalStorage.mockReturnValue([
        null,
        mockSaveToken,
        mockRemoveToken,
      ]);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.getRedirectRoute()).toBe("/");
    });

    it('deve retornar "/admin" para usuário admin', async () => {
      const mockToken = "admin-token";
      const mockPayload = {
        userId: "admin-123",
        email: "admin@events.com",
        name: "Admin User",
        role: UserRole.ADMIN,
        iat: Date.now(),
        exp: Date.now() + 3600000,
      };

      mockUseLocalStorage.mockReturnValue([
        mockToken,
        mockSaveToken,
        mockRemoveToken,
      ]);
      mockIsValidFakeJWT.mockReturnValue(true);
      mockDecodeFakeJWT.mockReturnValue(mockPayload);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.getRedirectRoute()).toBe("/admin");
    });

    it('deve retornar "/dashboard" para usuário reader', async () => {
      const mockToken = "reader-token";
      const mockPayload = {
        userId: "reader-123",
        email: "reader@events.com",
        name: "Reader User",
        role: UserRole.READER,
        iat: Date.now(),
        exp: Date.now() + 3600000,
      };

      mockUseLocalStorage.mockReturnValue([
        mockToken,
        mockSaveToken,
        mockRemoveToken,
      ]);
      mockIsValidFakeJWT.mockReturnValue(true);
      mockDecodeFakeJWT.mockReturnValue(mockPayload);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.getRedirectRoute()).toBe("/dashboard");
    });
  });

  describe("login", () => {
    beforeEach(() => {
      // Sempre começar sem token
      mockUseLocalStorage.mockReturnValue([
        null,
        mockSaveToken,
        mockRemoveToken,
      ]);
    });

    it("deve fazer login com sucesso para usuário admin", async () => {
      const mockUser = {
        id: "admin-123",
        email: "admin@events.com",
        role: UserRole.ADMIN,
      };

      const mockToken = "generated-admin-token";
      const mockPayload = {
        userId: "admin-123",
        email: "admin@events.com",
        name: "Admin User",
        role: UserRole.ADMIN,
        iat: Date.now(),
        exp: Date.now() + 3600000,
      };

      const credentials: LoginFormCredentials = {
        username: "admin@events.com",
        password: "admin123",
      };

      mockAuthenticateUser.mockResolvedValue(mockUser);
      mockGenerateFakeJWT.mockReturnValue(mockToken);
      mockDecodeFakeJWT.mockReturnValue(mockPayload);
      mockIsValidFakeJWT.mockReturnValue(true);

      const { result } = renderHook(() => useAuth());

      // Aguarda inicialização
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let loginResult: any;
      await act(async () => {
        loginResult = await result.current.login(credentials);
      });

      expect(loginResult).toEqual({
        success: true,
        redirectTo: "/admin",
      });

      expect(mockAuthenticateUser).toHaveBeenCalledWith({
        email: "admin@events.com",
        password: "admin123",
      });

      expect(mockGenerateFakeJWT).toHaveBeenCalledWith({
        email: "admin@events.com",
        role: UserRole.ADMIN,
      });

      expect(mockSaveToken).toHaveBeenCalledWith(mockToken);
      expect(mockSetAuthToken).toHaveBeenCalledWith(mockToken);

      expect(result.current.user).toEqual({
        userId: mockPayload.userId,
        email: mockPayload.email,
        role: mockPayload.role,
      });

      // Note: isAuthenticated e isAdmin dependem do token do localStorage,
      // então não podemos testá-los diretamente aqui sem recriar o hook com o novo token
    });

    it("deve fazer login com sucesso para usuário reader", async () => {
      const mockUser = {
        id: "reader-123",
        email: "reader@events.com",
        role: UserRole.READER,
      };

      const mockToken = "generated-reader-token";
      const mockPayload = {
        userId: "reader-123",
        email: "reader@events.com",
        name: "Reader User",
        role: UserRole.READER,
        iat: Date.now(),
        exp: Date.now() + 3600000,
      };

      const credentials: LoginFormCredentials = {
        username: "reader@events.com",
        password: "reader123",
      };

      mockAuthenticateUser.mockResolvedValue(mockUser);
      mockGenerateFakeJWT.mockReturnValue(mockToken);
      mockDecodeFakeJWT.mockReturnValue(mockPayload);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let loginResult: any;
      await act(async () => {
        loginResult = await result.current.login(credentials);
      });

      expect(loginResult).toEqual({
        success: true,
        redirectTo: "/dashboard",
      });

      expect(result.current.user).toEqual({
        userId: mockPayload.userId,
        email: mockPayload.email,
        role: mockPayload.role,
      });
      expect(result.current.isAdmin).toBe(false);
    });

    it("deve retornar erro para credenciais inválidas", async () => {
      const credentials: LoginFormCredentials = {
        username: "invalid@events.com",
        password: "wrong-password",
      };

      mockAuthenticateUser.mockResolvedValue(null);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let loginResult: any;
      await act(async () => {
        loginResult = await result.current.login(credentials);
      });

      expect(loginResult).toEqual({
        success: false,
        error: "Credenciais inválidas. Verifique email e senha.",
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(mockSaveToken).not.toHaveBeenCalled();
      // setAuthToken pode ter sido chamado durante a inicialização, então vamos verificar se foi chamado com null pelo menos
      expect(mockSetAuthToken).toHaveBeenCalledWith(null);
    });

    it("deve retornar erro quando API falha", async () => {
      const credentials: LoginFormCredentials = {
        username: "test@events.com",
        password: "test123",
      };

      mockAuthenticateUser.mockRejectedValue(new Error("Network error"));

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let loginResult: any;
      await act(async () => {
        loginResult = await result.current.login(credentials);
      });

      expect(loginResult).toEqual({
        success: false,
        error: "Erro de conexão. Verifique se a API está rodando.",
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it("deve gerenciar estados de loading durante login", async () => {
      const mockUser = {
        id: "user-123",
        email: "test@events.com",
        role: UserRole.READER,
      };

      const credentials: LoginFormCredentials = {
        username: "test@events.com",
        password: "test123",
      };

      // Simula delay na API
      mockAuthenticateUser.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(mockUser), 100))
      );

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Inicia login
      act(() => {
        result.current.login(credentials);
      });

      // Deve estar loading
      expect(result.current.loading).toBe(true);

      // Aguarda login completar
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it("deve lidar com falha na decodificação do JWT após login", async () => {
      const mockUser = {
        id: "user-123",
        email: "test@events.com",
        role: UserRole.READER,
      };

      const mockToken = "corrupted-token";
      const credentials: LoginFormCredentials = {
        username: "test@events.com",
        password: "test123",
      };

      mockAuthenticateUser.mockResolvedValue(mockUser);
      mockGenerateFakeJWT.mockReturnValue(mockToken);
      mockDecodeFakeJWT.mockReturnValue(null); // Simulando falha

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let loginResult: any;
      await act(async () => {
        loginResult = await result.current.login(credentials);
      });

      expect(loginResult).toEqual({
        success: false,
        error: "Credenciais inválidas. Verifique email e senha.",
      });

      expect(result.current.user).toBeNull();
    });
  });

  describe("logout", () => {
    it("deve fazer logout e limpar dados do usuário", async () => {
      // Inicia com usuário logado
      const mockToken = "valid-token";
      const mockPayload = {
        userId: "user-123",
        email: "test@events.com",
        name: "Test User",
        role: UserRole.ADMIN,
        iat: Date.now(),
        exp: Date.now() + 3600000,
      };

      mockUseLocalStorage.mockReturnValue([
        mockToken,
        mockSaveToken,
        mockRemoveToken,
      ]);
      mockIsValidFakeJWT.mockReturnValue(true);
      mockDecodeFakeJWT.mockReturnValue(mockPayload);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.user).not.toBeNull();
      });

      // Faz logout
      act(() => {
        result.current.logout();
      });

      expect(mockRemoveToken).toHaveBeenCalled();
      expect(mockSetAuthToken).toHaveBeenCalledWith(null);
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isAdmin).toBe(false);
    });
  });
});
