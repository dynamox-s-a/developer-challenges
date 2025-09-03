import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:80/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.message ||
                   error?.response?.data?.error ||
                   error?.message ||
                   "Ocorreu um erro. Tente novamente.";
    return Promise.reject(new Error(message));
  }
);

export interface Machine {
  id: number;
  name: string;
  serialNumber: string;
  description?: string;
  type: number;
  createdAt: string;
  updatedAt?: string;
}

export const MachineService = {
  async getAll(): Promise<Machine[]> {
    const response = await api.get<Machine[]>("/machines");
    return response.data;
  },

  async getById(id: number): Promise<Machine> {
    const response = await api.get<Machine>(`/machines/${id}`);
    return response.data;
  },

  async create(machine: Omit<Machine, "id" | "createdAt" | "updatedAt">): Promise<Machine> {
    const response = await api.post<Machine>("/machines", machine);
    return response.data;
  },

  async update(id: number, machine: Partial<Machine>): Promise<Machine> {
    // Get the current machine data first
    const currentMachine = await this.getById(id);
    
    // Prepare the update payload with only changed fields
    const updates: Partial<Machine> = {};
    
    // Check each field and add to updates if it has changed
    if (machine.name !== undefined && machine.name !== currentMachine.name) {
      updates.name = machine.name;
    }
    
    if (machine.serialNumber !== undefined && machine.serialNumber !== currentMachine.serialNumber) {
      updates.serialNumber = machine.serialNumber;
    }
    
    if (machine.description !== undefined && machine.description !== currentMachine.description) {
      updates.description = machine.description;
    }
    
    if (machine.type !== undefined && machine.type !== currentMachine.type) {
      updates.type = Number(machine.type);
    }
    
    // Only send the request if there are changes
    if (Object.keys(updates).length === 0) {
      return currentMachine; // No changes to update
    }
    
    const response = await api.put<Machine>(`/machines/${id}`, updates);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/machines/${id}`);
  },
};

export default api;
