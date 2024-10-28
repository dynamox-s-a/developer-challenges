import { PrismaService } from 'src/database/prisma.service';
import { MachineRepository } from '../MachineRepository/machine.repository';
import { Injectable } from '@nestjs/common';
import { Machine } from '@prisma/client';

@Injectable()
export class PrismaMachineRepository implements MachineRepository {
  constructor(private prisma: PrismaService) {}

  async create(machine: Omit<Machine, 'id'>): Promise<void> {
    try {
      await this.prisma.machine.create({
        data: { name: machine.name, type: machine.type },
      });
    } catch (err: any) {
      throw new Error(`Error creating the machine: ${err.message}`);
    }
  }

  async getAll(): Promise<Machine[]> {
    try {
      let allMachines = await this.prisma.machine.findMany();
      return allMachines;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async getById(id: number): Promise<Machine | null> {
    try {
      let machine = await this.prisma.machine.findUnique({
        where: {
          id: id,
        },
      });
      if (machine == null) {
        return;
      } else {
        return machine;
      }
    } catch (err) {
      throw err;
    }
  }

  async getByMachine(machine: Omit<Machine, 'id'>): Promise<Machine | null> {
    try {
      let existingMachine = await this.prisma.machine.findUnique({
        where: {
          name: machine.name,
        },
      });
      if (machine == null) {
        return;
      } else {
        return existingMachine;
      }
    } catch (err) {
      throw err;
    }
  }

  async update(machine: Machine): Promise<void> {
    try {
      const existingMachine = await this.prisma.machine.findUnique({
        where: {
          id: machine.id,
        },
      });
      if (!existingMachine) {
        throw new Error('Machine not found!');
      }
      await this.prisma.machine.update({
        where: {
          id: existingMachine.id,
        },
        data: {
          name: machine.name == undefined ? existingMachine.name : machine.name,
          type: machine.type == undefined ? existingMachine.type : machine.type,
        },
      });
    } catch (err: any) {
      throw new Error(`Error updating the machine ${err.message}`);
    }
  }
  async delete(id: number): Promise<void> {
    try {
      await this.prisma.machine.delete({
        where: {
          id: id,
        },
      });
    } catch (err) {
      throw err.message;
    }
  }
}
