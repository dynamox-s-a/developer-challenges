import api from './client';
import type { CreateMachineRequest, CreateMachineResponse, MachinesListResponse, PatchMachineRequest, PatchMachineResponse } from '@dynamox/types';

export const machinesAPI = {
  getMachines: () => api.get<MachinesListResponse>('/machines'),
  createMachine: (data: CreateMachineRequest) => api.post<CreateMachineResponse>('/machines', data),
  updateMachine: (uuid: string, data: PatchMachineRequest) => api.patch<PatchMachineResponse>(`/machines/${uuid}`, data),
  deleteMachine: (uuid: string) => api.delete(`/machines/${uuid}`),
};
