import { Inject, Injectable } from '@nestjs/common';
import { machinesTable } from 'src/modules/drizzle/schema';
import {
  DRIZZLE,
  type DrizzleConnection,
} from 'src/modules/drizzle/drizzle.module';
import Machine, { MachineType } from 'src/entities/machine.entity';
import { eq } from 'drizzle-orm';

@Injectable()
export class MachineRepository {
  constructor(@Inject(DRIZZLE) private drizzleConnection: DrizzleConnection) {}

  async list(): Promise<Machine[]> {
    try {
      const result = await this.drizzleConnection.select().from(machinesTable);

      return result as Machine[];
    } catch (error) {
      console.error('Error on MachineRepository.list', error);
      return [];
    }
  }

  async find(id: number): Promise<Machine | null> {
    try {
      const result = await this.drizzleConnection
        .select()
        .from(machinesTable)
        .where(eq(machinesTable.id, id));

      console.log('result', result);
      return result[0] as Machine;
    } catch (error) {
      console.error('Error on MachineRepository.get', error);
      return null;
    }
  }

  async create(name: string, type: MachineType): Promise<boolean> {
    const newMachine: typeof machinesTable.$inferInsert = {
      name,
      type,
    };
    try {
      const result = await this.drizzleConnection
        .insert(machinesTable)
        .values(newMachine);

      return result.rowsAffected > 0;
    } catch (error) {
      console.error('Error on MachineRepository.create', error);
      return false;
    }
  }

  async update(id: number, name: string, type: MachineType): Promise<boolean> {
    try {
      const result = await this.drizzleConnection
        .update(machinesTable)
        .set({ name, type })
        .where(eq(machinesTable.id, id));

      return result.rowsAffected > 0;
    } catch (error) {
      console.error('Error on MachineRepository.update', error);
      return false;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const result = await this.drizzleConnection
        .delete(machinesTable)
        .where(eq(machinesTable.id, id));

      return result.rowsAffected > 0;
    } catch (error) {
      console.error('Error on MachineRepository.delete', error);
      return false;
    }
  }
}
