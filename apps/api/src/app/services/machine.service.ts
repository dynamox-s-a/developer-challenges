import { MachineRepository, CreateMachineData, UpdateMachineData } from '../repositories/machine.repository';

export function createMachineService(machineRepository: MachineRepository) {
  return {
    findAll: () => machineRepository.findAll(),

    findById: async (id: string) => {
      const machine = await machineRepository.findById(id);
      if (!machine) {
        throw new Error('Machine not found');
      }
      return machine;
    },

    create: (data: CreateMachineData) => machineRepository.create(data),

    update: async (id: string, data: UpdateMachineData) => {
      const existing = await machineRepository.findById(id);
      if (!existing) {
        throw new Error('Machine not found');
      }
      return machineRepository.update(id, data);
    },

    delete: async (id: string) => {
      const existing = await machineRepository.findById(id);
      if (!existing) {
        throw new Error('Machine not found');
      }
      return machineRepository.delete(id);
    },
  };
}

export type MachineService = ReturnType<typeof createMachineService>;
