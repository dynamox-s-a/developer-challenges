import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, type Machine as PrismaMachine } from '@prisma/client';

import type { MachineType } from '@dynamox/domain';

import { toDomainMachineType, toPrismaMachineType } from '../common/machine-type.mapper';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateMachineDto, UpdateMachineDto } from './machines.dto';

export interface MachineDto {
  id: string;
  name: string;
  type: MachineType;
  createdAt: string;
  updatedAt: string;
}

/** A resposta usa sempre o vocabulário público (Pump/Fan), nunca o enum do Prisma. */
function toDto(machine: PrismaMachine): MachineDto {
  return {
    id: machine.id,
    name: machine.name,
    type: toDomainMachineType(machine.type),
    createdAt: machine.createdAt.toISOString(),
    updatedAt: machine.updatedAt.toISOString(),
  };
}

function isUniqueViolation(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
}

function isRecordNotFound(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025';
}

@Injectable()
export class MachinesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateMachineDto): Promise<MachineDto> {
    try {
      const machine = await this.prisma.machine.create({
        data: { name: dto.name, type: toPrismaMachineType(dto.type) },
      });
      return toDto(machine);
    } catch (error) {
      // A unicidade do nome é garantida pelo índice do PostgreSQL, e não por uma
      // consulta prévia: assim duas requisições concorrentes não criam duplicata.
      if (isUniqueViolation(error)) throw this.nameConflict(dto.name);
      throw error;
    }
  }

  /** Ordenação determinística por nome, para a listagem não variar entre chamadas. */
  async list(): Promise<MachineDto[]> {
    const machines = await this.prisma.machine.findMany({ orderBy: { name: 'asc' } });
    return machines.map(toDto);
  }

  async findOne(id: string): Promise<MachineDto> {
    const machine = await this.prisma.machine.findUnique({ where: { id } });
    if (!machine) throw this.notFound(id);
    return toDto(machine);
  }

  async update(id: string, dto: UpdateMachineDto): Promise<MachineDto> {
    try {
      const machine = await this.prisma.$transaction(async (tx) => {
        // O update toma o lock da linha da máquina; a verificação de sensores abaixo
        // roda com esse lock, serializando este PATCH contra associações concorrentes
        // de sensor (que também travam a linha da máquina antes de decidir a regra).
        const updated = await tx.machine.update({
          where: { id },
          data: {
            ...(dto.name !== undefined ? { name: dto.name } : {}),
            ...(dto.type !== undefined ? { type: toPrismaMachineType(dto.type) } : {}),
          },
        });

        // Regra do enunciado em toda transição relevante: uma máquina não pode virar
        // Pump se algum dos seus pontos tiver sensor TcAg ou TcAs. O throw desfaz o
        // update — a transação garante que a violação nunca chega ao banco.
        if (dto.type === 'Pump') {
          const blocked = await tx.sensor.findMany({
            where: {
              monitoringPoint: { machineId: id },
              model: { in: ['TC_AG', 'TC_AS'] },
            },
            select: { serialNumber: true, model: true },
            orderBy: { serialNumber: 'asc' },
          });
          if (blocked.length > 0) {
            const serials = blocked.map((sensor) => sensor.serialNumber).join(', ');
            throw new ConflictException({
              code: 'MACHINE_TYPE_SENSOR_CONFLICT',
              message: `A máquina não pode virar Pump: sensor(es) TcAg/TcAs associado(s) (${serials}).`,
            });
          }
        }

        return updated;
      });
      return toDto(machine);
    } catch (error) {
      if (isUniqueViolation(error)) throw this.nameConflict(dto.name ?? '');
      if (isRecordNotFound(error)) throw this.notFound(id);
      throw error;
    }
  }

  /**
   * Excluir a máquina remove em cascata seus pontos de monitoramento (política já
   * declarada no schema); os sensores são apenas desassociados, não apagados.
   */
  async remove(id: string): Promise<void> {
    try {
      await this.prisma.machine.delete({ where: { id } });
    } catch (error) {
      if (isRecordNotFound(error)) throw this.notFound(id);
      throw error;
    }
  }

  private nameConflict(name: string): ConflictException {
    return new ConflictException({
      code: 'MACHINE_NAME_CONFLICT',
      message: `Já existe uma máquina com o nome "${name}".`,
    });
  }

  private notFound(id: string): NotFoundException {
    return new NotFoundException({
      code: 'MACHINE_NOT_FOUND',
      message: `Máquina "${id}" não encontrada.`,
    });
  }
}
