import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PointsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; machineId: string; sensor?: { id: string; model: string } }) {
    // 1. Regra de Negócio: Buscar a máquina para ver o tipo
    const machine = await this.prisma.machine.findUnique({
      where: { id: data.machineId }
    });

    if (!machine) {
      throw new BadRequestException('Máquina não encontrada');
    }

    // 2. Validação: Se for Bomba, não aceita TcAg nem TcAs
    if (data.sensor && machine.type === 'Bomba') {
      const forbiddenModels = ['TcAg', 'TcAs'];
      if (forbiddenModels.includes(data.sensor.model)) {
        throw new BadRequestException(
          `Máquinas do tipo 'Bomba' não aceitam sensores do modelo ${data.sensor.model}`
        );
      }
    }

    // 3. Salvar no banco (Cria o Ponto E o Sensor junto)
    return this.prisma.monitoringPoint.create({
      data: {
        name: data.name,
        machineId: data.machineId,
        // Se veio sensor, cria ele aninhado
        sensor: data.sensor ? {
          create: {
            id: data.sensor.id,
            model: data.sensor.model
          }
        } : undefined
      },
      include: { sensor: true } // Retorna o sensor criado na resposta
    });
  }

  findAll() {
    // Traz a lista completa: Ponto + Nome da Máquina + Sensor
    return this.prisma.monitoringPoint.findMany({
      include: {
        machine: true,
        sensor: true
      }
    });
  }

  remove(id: string) {
    return this.prisma.monitoringPoint.delete({ where: { id } });
  }
}