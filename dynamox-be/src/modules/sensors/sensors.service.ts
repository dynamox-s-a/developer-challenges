import { Injectable } from '@nestjs/common';
import { Sensor } from '@prisma/client';
import { PrismaService } from 'modules/database/prisma.service';

@Injectable()
export class SensorsService {
    constructor(private readonly prisma: PrismaService) {}

    async getAll(): Promise<Sensor[]> {
        return  await this.prisma.sensor.findMany();
    }

}