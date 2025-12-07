import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MachinesService {
  constructor(private prisma: PrismaService) {}

  // 1. Criar uma nova máquina
  create(data: Prisma.MachineCreateInput) {
    return this.prisma.machine.create({ data });
  }

  // 2. Listar todas as máquinas (trazendo os pontos de monitoramento junto)
  findAll() {
    return this.prisma.machine.findMany({
      include: { monitoringPoints: true }
    });
  }

  // 3. Buscar uma máquina específica pelo ID
  findOne(id: string) {
    return this.prisma.machine.findUnique({
      where: { id },
      include: { monitoringPoints: true }
    });
  }

  // 4. Atualizar uma máquina
  update(id: string, data: Prisma.MachineUpdateInput) {
    return this.prisma.machine.update({
      where: { id },
      data,
    });
  }

  // 5. Deletar uma máquina
  remove(id: string) {
    return this.prisma.machine.delete({ where: { id } });
  }
}