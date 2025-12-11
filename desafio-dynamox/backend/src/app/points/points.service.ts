import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePointDto } from './dto/create-point.dto';

@Injectable()
export class PointsService {
  constructor(private prisma: PrismaService) {}
/*
  async create(data: { name: string; machineId: string; sensor?: { id: string; model: string } }) {
   
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
*/
  create(CreatePointDto: CreatePointDto) {
    return this.prisma.monitoringPoint.create({ 
      data: {
        name: CreatePointDto.name,
        machineId: CreatePointDto.machineId,
        sensorModel: CreatePointDto.sensorModel,
      }
      });
  }

  findAll() {
    return this.prisma.monitoringPoint.findMany();
  }

  findOne(id: string) {
    return this.prisma.monitoringPoint.findUnique({ where: { id } });
  }

  update(id: string, updatePointDto: any) {
    return this.prisma.monitoringPoint.update({ where: { id }, data: updatePointDto });
  }

  remove(id: string) {
    return this.prisma.monitoringPoint.delete({ where: { id } });
  }
}