import axios from "axios"
import type { Machine, MonitoringPoint } from "@/types"

// Configure your backend URL here
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

export const api = {
  // Machines
  async getMachines(): Promise<Machine[]> {
    const response = await apiClient.get("/machines")
    return response.data
  },

  async createMachine(machine: Omit<Machine, "id">): Promise<Machine> {
    const response = await apiClient.post("/machines", machine)
    return response.data
  },

  async updateMachine(id: string, machine: Partial<Machine>): Promise<Machine> {
    const response = await apiClient.put(`/machines/${id}`, machine)
    return response.data
  },

  async deleteMachine(id: string): Promise<void> {
    await apiClient.delete(`/machines/${id}`)
  },

  // Monitoring Points
  async getMonitoringPoints(): Promise<MonitoringPoint[]> {
    const response = await apiClient.get("/monitoring-points")
    return response.data
  },

  async createMonitoringPoint(point: Omit<MonitoringPoint, "id">): Promise<MonitoringPoint> {
    const response = await apiClient.post("/monitoring-points", point)
    return response.data
  },

  async deleteMonitoringPoint(id: string): Promise<void> {
    await apiClient.delete(`/monitoring-points/${id}`)
  },
}
