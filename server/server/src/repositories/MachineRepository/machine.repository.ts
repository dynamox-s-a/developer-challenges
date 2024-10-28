import { Machine } from '@prisma/client';

export abstract class MachineRepository {
  abstract create(machine: Omit<Machine, 'id'>): Promise<void>;
  abstract getById(id: number): Promise<Machine | null>;
  abstract getByMachine(machine: Omit<Machine, 'id'>): Promise<Machine | null>;
  abstract getAll(): Promise<Machine[]>;
  abstract update(machine: Machine): Promise<void>;
  abstract delete(id: number): Promise<void>;
}
