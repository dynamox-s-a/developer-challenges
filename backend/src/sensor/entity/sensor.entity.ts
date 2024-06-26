import { Prisma } from '@prisma/client'

export class Sensor implements Prisma.SensorCreateInput {
    sensor_id: number
    monitoring_point_id: number 
    machine_id: number
    monitoring_point?: string
    sensor_type: string
}