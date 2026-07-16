import type { Machine } from '@repo/contracts';

export type MachineRepository = {
  findAll(): Promise<Machine[]>;
  findById(id: string): Promise<Machine | null>;
};
