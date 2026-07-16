import type { Machine } from '@repo/contracts';

import type { MachineRepository } from '../domain/machine-repository';

export const makeListMachines = (machineRepository: MachineRepository) => async (): Promise<Machine[]> =>
  machineRepository.findAll();

export const makeGetMachine =
  (machineRepository: MachineRepository) =>
  async (id: string): Promise<Machine | null> =>
    machineRepository.findById(id);
