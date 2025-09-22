/**
 * API Client para comunicação com json-server
 * Permite consumir dados do db.json
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface User {
  id: number;
  email: string;
  password: string;
  role: "admin" | "reader";
}

export interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  description: string;
  category: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: Omit<User, "password">;
  token: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Define o token de autorização
   */
  setAuthToken(token: string | null) {
    this.token = token;
  }

  /**
   * Realiza requisição HTTP genérica
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    // Adiciona token de autorização se disponível
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      headers,
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(
          `HTTP Error: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`API Request failed for ${url}:`, error);
      throw error;
    }
  }

  // === USER ENDPOINTS ===

  /**
   * Busca todos os usuários
   */
  async getUsers(): Promise<User[]> {
    return this.request<User[]>("/user");
  }

  /**
   * Busca usuário por ID
   */
  async getUserById(id: string): Promise<User> {
    return this.request<User>(`/user/${id}`);
  }

  /**
   * Autentica usuário com email e senha
   */
  async authenticateUser(credentials: LoginCredentials): Promise<User | null> {
    try {
      const users = await this.getUsers();

      const user = users.find(
        (u) =>
          u.email === credentials.email && u.password === credentials.password
      );

      return user || null;
    } catch (error) {
      console.error("Authentication error:", error);
      return null;
    }
  }

  // === EVENT ENDPOINTS ===

  /**
   * Busca todos os eventos
   */
  async getEvents(): Promise<Event[]> {
    return this.request<Event[]>("/event");
  }

  /**
   * Busca evento por ID
   */
  async getEventById(id: string): Promise<Event> {
    return this.request<Event>(`/event/${id}`);
  }

  /**
   * Cria novo evento
   */
  async createEvent(event: Omit<Event, "id">): Promise<Event> {
    return this.request<Event>("/event", {
      method: "POST",
      body: JSON.stringify(event),
    });
  }

  /**
   * Atualiza evento existente
   */
  async updateEvent(id: string, event: Partial<Event>): Promise<Event> {
    return this.request<Event>(`/event/${id}`, {
      method: "PUT",
      body: JSON.stringify(event),
    });
  }

  /**
   * Remove evento
   */
  async deleteEvent(id: string): Promise<void> {
    return this.request<void>(`/event/${id}`, {
      method: "DELETE",
    });
  }

  // === HEALTH CHECK ===

  /**
   * Verifica se a API está funcionando
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.request("/user?_limit=1");
      return true;
    } catch (error) {
      console.warn("API health check failed:", error);
      return false;
    }
  }
}

// Instância singleton do cliente da API
export const apiClient = new ApiClient();

// Função para definir o token de autorização
export const setAuthToken = (token: string | null) => {
  apiClient.setAuthToken(token);
};

// Export individual functions for convenience
export const getUsers = () => apiClient.getUsers();
export const getUserById = (id: string) => apiClient.getUserById(id);
export const authenticateUser = (credentials: LoginCredentials) =>
  apiClient.authenticateUser(credentials);
export const getEvents = () => apiClient.getEvents();
export const getEventById = (id: string) => apiClient.getEventById(id);
export const createEvent = (event: Omit<Event, "id">) =>
  apiClient.createEvent(event);
export const updateEvent = (id: string, event: Partial<Event>) =>
  apiClient.updateEvent(id, event);
export const deleteEvent = (id: string) => apiClient.deleteEvent(id);
export const healthCheck = () => apiClient.healthCheck();
