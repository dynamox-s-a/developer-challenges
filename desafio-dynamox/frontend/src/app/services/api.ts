import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export interface MachineData{
  id: string;
  name: string;
  type: 'Bomba' | 'Ventilador';
  status?: 'online' | 'offline' | 'maintenance';
}

export interface PointData{
  id: string;
  name: string;
  machineId: string;
  sensor?: {
    id: string;
    model: 'TcAg' | 'TcAs' | 'HF+';
  }
  status?: 'active' | 'archived';
}