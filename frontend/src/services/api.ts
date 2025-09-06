import { toast } from "sonner";

const API_URL = "http://localhost:3000";

interface ApiOptions {
  method: string;
  headers: Record<string, string>;
  body?: string;
}

export interface AuthResponse {
  access_token?: string;
  token?: string;
}

export interface User {
  id: number;
  email: string;
}

export enum MachineType {
  Pump = "Pump",
  Fan = "Fan",
}

export enum SensorModel {
  TcAg = "TcAg",
  TcAs = "TcAs",
  HFPlus = "HFPlus",
}

export interface Machine {
  id: number;
  name: string;
  type: MachineType;
  createdAt: string;
}

export interface MonitoringPoint {
  id: number;
  name: string;
  machineId: number;
  machine: Machine;
  sensor?: Sensor;
}

export interface Sensor {
  id: number;
  model: SensorModel;
  monitoringPointId: number;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

const apiCall = async <T>(
  endpoint: string,
  options: ApiOptions,
  requiresAuth = true,
): Promise<T> => {
  try {
    if (requiresAuth) {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Not authenticated");
      }
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    const response = await fetch(`${API_URL}${endpoint}`, options);

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: `HTTP error! status: ${response.status}`,
      }));
      throw new Error(error.message || "Something went wrong");
    }

    if (response.status === 204) {
      return {} as T;
    }

    const text = await response.text();
    if (!text) {
      return {} as T;
    }

    try {
      return JSON.parse(text) as T;
    } catch (error) {
      console.error("Failed to parse response as JSON:", text);
      throw new Error("Invalid JSON response from server");
    }
  } catch (error) {
    toast.error(error.message || "An error occurred");
    throw error;
  }
};

export const signUp = (email: string, password: string) => {
  return apiCall<AuthResponse>(
    "/auth/signup",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    },
    false,
  );
};

export const signIn = (email: string, password: string) => {
  return apiCall<AuthResponse>(
    "/auth/signin",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    },
    false,
  );
};

export const getCurrentUser = () => {
  return apiCall<User>("/auth/me", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
};

export const createMachine = (name: string, type: MachineType) => {
  return apiCall<Machine>("/machines", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, type }),
  });
};

export const getMachines = () => {
  return apiCall<Machine[]>("/machines", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
};

export const getMachineById = (id: number) => {
  return apiCall<Machine>(`/machines/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
};

export const updateMachine = (id: number, name: string, type: MachineType) => {
  return apiCall<Machine>(`/machines/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, type }),
  });
};

export const deleteMachine = (id: number) => {
  return apiCall<void>(`/machines/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
};

export const createMonitoringPoint = (name: string, machineId: number) => {
  return apiCall<MonitoringPoint>("/monitoring-points", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, machineId }),
  });
};

export const getMonitoringPoints = (options?: PaginationOptions) => {
  const queryParams = options
    ? `?page=${options.page}&limit=${options.limit}${
        options.sortBy ? `&sortBy=${options.sortBy}` : ""
      }${options.sortOrder ? `&sortOrder=${options.sortOrder}` : ""}`
    : "";

  return apiCall<MonitoringPoint[]>(`/monitoring-points${queryParams}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
};

export const getMonitoringPointById = (id: number) => {
  return apiCall<MonitoringPoint>(`/monitoring-points/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
};

export const updateMonitoringPoint = (
  id: number,
  name: string,
  machineId: number,
) => {
  return apiCall<MonitoringPoint>(`/monitoring-points/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, machineId }),
  });
};

export const deleteMonitoringPoint = (id: number) => {
  return apiCall<void>(`/monitoring-points/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
};

export const createSensor = (model: SensorModel, monitoringPointId: number) => {
  return apiCall<Sensor>("/sensors", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, monitoringPointId }),
  });
};

export const getSensors = () => {
  return apiCall<Sensor[]>("/sensors", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
};
