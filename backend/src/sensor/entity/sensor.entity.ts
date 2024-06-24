import { Prisma } from '@prisma/client'

export class Sensor implements Prisma.SensorCreateInput {
    machine_id: number
    monitoring_point?: string
    sensor_type: string
}