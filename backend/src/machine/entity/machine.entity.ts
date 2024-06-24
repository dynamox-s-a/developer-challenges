import { Prisma } from '@prisma/client'

export class Machine implements Prisma.MachineCreateInput {
    machine_id: number
    user_id: number
    machine_type: string
    machine_name: string
}