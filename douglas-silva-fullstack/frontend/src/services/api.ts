import axios from "axios";

/**
 * Configuração base da API com axios
 * A URL base é obtida da variável de ambiente VITE_API_BASE_URL ou usa o valor padrão
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:80/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de respostas para tratar erros de forma amigável
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Ocorreu um erro. Tente novamente.";
    return Promise.reject(new Error(message));
  }
);

/**
 * Interface que representa uma máquina no sistema
 */
export interface Machine {
  id: number;
  name: string;
  serialNumber: string;
  description?: string;
  type: number;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Serviço para operações relacionadas a máquinas
 */
export const MachineService = {
  /**
   * Obtém todas as máquinas cadastradas
   * @returns Promise com a lista de máquinas
   */
  async getAll(): Promise<Machine[]> {
    const response = await api.get<Machine[]>("/machines");
    return response.data;
  },

  /**
   * Obtém uma máquina pelo seu ID
   * @param id - ID da máquina a ser buscada
   * @returns Promise com os dados da máquina
   * @throws {Error} Se a máquina não for encontrada
   */
  async getById(id: number): Promise<Machine> {
    const response = await api.get<Machine>(`/machines/${id}`);
    return response.data;
  },

  /**
   * Cria uma nova máquina
   * @param machine - Dados da máquina a ser criada (sem ID e timestamps)
   * @returns Promise com a máquina criada
   */
  async create(
    machine: Omit<Machine, "id" | "createdAt" | "updatedAt">
  ): Promise<Machine> {
    const response = await api.post<Machine>("/machines", machine);
    return response.data;
  },

  /**
   * Atualiza uma máquina existente
   * @param id - ID da máquina a ser atualizada
   * @param machine - Dados parciais da máquina para atualização
   * @returns Promise com a máquina atualizada
   * @throws {Error} Se a máquina não for encontrada
   */
  async update(id: number, machine: Partial<Machine>): Promise<Machine> {
    // Garante que o tipo seja um número para compatibilidade com o backend
    const payload = {
      ...machine,
      type:
        typeof machine.type === "string"
          ? parseInt(machine.type, 10)
          : machine.type,
    };
    const response = await api.put<Machine>(`/machines/${id}`, payload);
    return response.data;
  },

  /**
   * Remove uma máquina do sistema
   * @param id - ID da máquina a ser removida
   * @returns Promise vazia em caso de sucesso
   * @throws {Error} Se a máquina não for encontrada
   */
  async delete(id: number): Promise<void> {
    await api.delete(`/machines/${id}`);
  },
};

export default api;
