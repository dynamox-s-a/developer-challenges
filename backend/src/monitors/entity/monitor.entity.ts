import { Prisma } from '@prisma/client'

export class Monitors implements Prisma.MonitoringPointCreateInput {
    monitoring_point_id: number   
    machine_id: number            
    monitoring_point_name: string 
}