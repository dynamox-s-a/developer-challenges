import type {
  MachineDetailDto,
  MachineDto,
  MachineInput,
  MachineSortField,
  Paginated,
  SortDirection,
} from '@dynapredict/shared-types';
import { apiClient } from './apiClient';

export interface MachinesQuery {
  page: number;
  pageSize: number;
  sortBy: MachineSortField;
  sortDir: SortDirection;
}

export async function listMachines(
  query: MachinesQuery,
): Promise<Paginated<MachineDto>> {
  const { data } = await apiClient.get<Paginated<MachineDto>>('/machines', {
    params: query,
  });
  return data;
}

export async function getMachine(id: string): Promise<MachineDetailDto> {
  const { data } = await apiClient.get<MachineDetailDto>(`/machines/${id}`);
  return data;
}

export async function createMachine(input: MachineInput): Promise<MachineDto> {
  const { data } = await apiClient.post<MachineDto>('/machines', input);
  return data;
}

/** Fails with 422 if the new type forbids a sensor the machine already has. */
export async function updateMachine(
  id: string,
  input: MachineInput,
): Promise<MachineDto> {
  const { data } = await apiClient.put<MachineDto>(`/machines/${id}`, input);
  return data;
}

/** Hard delete; the database cascades to points, sensors and readings. */
export async function deleteMachine(id: string): Promise<void> {
  await apiClient.delete(`/machines/${id}`);
}
