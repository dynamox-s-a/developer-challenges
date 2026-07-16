import type { Machine } from '@repo/contracts';

import type { MachineRepository } from '../domain/machine-repository';

export const makeJsonMachineRepository = (machines: Machine[]): MachineRepository => ({
  async findAll() {
    return machines;
  },
  async findById(id) {
    return machines.find((machine) => machine.id === id) ?? null;
  },
});
