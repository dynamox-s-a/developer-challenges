import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { MonitoringPoint } from '@prisma/client';
import { AlreadyExistsException } from 'exceptions/already-exists.exception';
import { PrismaService } from 'modules/database/prisma.service';
import { CreateMonitoringPointDto, UpdateMonitoringPointDto } from './dto/monitoringPoints.dto';
import { MachineTypeEnum } from 'modules/machines/dto/machines.dto';
import { MonitoringPointWithRelations } from 'interfaces/monitoringPoints.interface';
import { SensorWithRelation } from 'interfaces/sensors.interface';

@Injectable()
export class MonitoringPointsService {
    constructor(private readonly prisma: PrismaService) { }

    async getAll(): Promise<MonitoringPointWithRelations[]> {
        return await this.prisma.monitoringPoint.findMany(
            {
                include: { machine: true, sensor: true }
            }
        );
    }

    async create(monitoringPointDto: CreateMonitoringPointDto): Promise<MonitoringPoint> {
        const [machine, sensor] = await Promise.all([
            this.prisma.machine.findUnique({ where: { uuid: monitoringPointDto.machineUUID } }),
            this.prisma.sensor.findUnique({
                where: { uuid: monitoringPointDto.sensorUUID },
                include: { monitoringPoint: true }
            })
        ]);

        if (!machine) throw new NotFoundException('Máquina não encontrada.');

        if (!sensor) throw new NotFoundException('Sensor não encontrado.');


        this.validateSensorNotAssociated(sensor);

        this.validateSensorModel(machine.type as MachineTypeEnum, sensor.modelName);

        return await this.prisma.monitoringPoint.create({
            data: {
                name: monitoringPointDto.name,
                machineId: machine.id,
                sensorId: sensor.id
            }
        });
    }

    async update(uuid: string, monitoringPointDto: UpdateMonitoringPointDto): Promise<MonitoringPoint> {
        let machine;
        let sensor;
    
        if (monitoringPointDto.machineUUID) {
            machine = await this.prisma.machine.findUnique({ where: { uuid: monitoringPointDto.machineUUID } });

            if (!machine) throw new NotFoundException('Máquina não encontrada.');
        }
    
        if (monitoringPointDto.sensorUUID) {
            sensor = await this.prisma.sensor.findUnique({
                where: { uuid: monitoringPointDto.sensorUUID },
                include: { monitoringPoint: true },
            });
            if (!sensor) throw new NotFoundException('Sensor não encontrado.');
        }
    
        this.validateSensorNotAssociated(sensor as SensorWithRelation);
    
        if (machine && sensor) {
            this.validateSensorModel(machine.type as MachineTypeEnum, sensor.modelName);
        }
    
        return await this.prisma.monitoringPoint.update({
            where: { uuid },
            data: {
                name: monitoringPointDto.name,
                machineId: machine?.id, 
                sensorId: sensor?.id,  
            },
        });
    }

    async delete(uuid: string): Promise<MonitoringPoint> {
        return await this.prisma.monitoringPoint.delete({
            where: { uuid }
        })
    }


    private validateSensorNotAssociated(sensor: SensorWithRelation): void {
        if (sensor.monitoringPoint) {
            throw new AlreadyExistsException('O sensor já está associado a um ponto de monitoramento existente.');
        }
    }

    private validateSensorModel(machineType: MachineTypeEnum, sensorModelName: string): void {
        if (machineType === MachineTypeEnum.Pump &&
            (sensorModelName === "TcAg" || sensorModelName === "TcAs")) {
            throw new BadRequestException('Não é possível associar sensores do tipo TcAg e TcAs a máquinas do tipo Pump');
        }
    }
}