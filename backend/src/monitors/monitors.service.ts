import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client'

import { CreateMonitorsDto } from './dto/create-monitor.dto'
import { UpdateMonitorsDto } from './dto/update-monitor.dto'
import { PrismaService } from '../prisma/prisma.service'
import { Monitors } from './entity/monitor.entity'

@Injectable()
export class MonitorsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createMonitorDto: CreateMonitorsDto): Promise<Monitors> {
        const data: Prisma.MonitoringPointCreateInput = {
            ...createMonitorDto,
        }

        const createdMonitor = await this.prisma.monitoringPoint.create({ data })

        return {
            ...createdMonitor,
        }
    }

    updateMonitor(id: number, updateMonitorDto: UpdateMonitorsDto) {
        const data: Prisma.MonitoringPointUpdateInput = {
            ...updateMonitorDto,
        }

        return this.prisma.monitoringPoint.update({
            where: { monitoring_point_id: id },
            data,
        })
    }

    findByMonitorId(id: number) {
        return this.prisma.monitoringPoint.findUnique({
            where: { monitoring_point_id: id },
        })
    }

    findByMachineId(id: number) {
        const monitorData = this.prisma.monitoringPoint.findMany({
            where: { machine_id: id },
        })

        return monitorData
    }

    removeMonitor(id: number) {
        return this.prisma.monitoringPoint.delete({
            where: { monitoring_point_id: id },
        })
    }
}
