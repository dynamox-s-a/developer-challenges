import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client'

import { CreateSensorDto } from './dto/create-sensor.dto'
import { UpdateSensorDto } from './dto/updtate-sensor.dto'
import { PrismaService } from '../prisma/prisma.service'
import { Sensor } from './entity/sensor.entity'

@Injectable()
export class SensorService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createSensorDto: CreateSensorDto): Promise<Sensor> {
        const data: Prisma.SensorCreateInput = {
            ...createSensorDto,
        }

        const createdSensor = await this.prisma.sensor.create({ data })

        return {
            ...createdSensor,
        }
    }

    findBySensorId(id: number) {
        return this.prisma.sensor.findUnique({
            where: { sensor_id: id},
        })
    }

    findByMachineId(id: number) {
        return this.prisma.sensor.findMany({
            where: { machine_id: id },
        })
    }

    findAll() {
        return this.prisma.sensor.findMany()
    }

    update(id: number, updateSensorDto: UpdateSensorDto) {
        const data: Prisma.SensorUpdateInput = {
            ...updateSensorDto,
        }

        return this.prisma.sensor.update({
            where: { sensor_id: id },
            data,
        })
    }

    remove(id: number) {
        return this.prisma.sensor.delete({
            where: { sensor_id: id },
        })
    }

}
