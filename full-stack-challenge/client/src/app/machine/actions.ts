import { api } from 'client/src/app/core/libs/axios';
import { PageRequest } from 'client/src/app/core/types/page-request';
import { PageResponse } from 'client/src/app/core/types/page-response';
import { MachineType } from './types/machine-type';

export default async function getAllMachines({ ...params }: PageRequest) {
  const response = await api.get('machines', { params });
  const remoteMachineList = response.data.data;
  const pageable: PageResponse<MachineType> = {
    page: params.page,
    size: params?.size || 1,
    totalPages: response.data.total / (params.size || 1),
    total: response.data.total,
    data: remoteMachineList,
  };
  return pageable;
}
