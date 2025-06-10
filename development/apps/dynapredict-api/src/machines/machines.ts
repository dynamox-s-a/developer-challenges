import { MachineType, User } from "@prisma/client"

export interface MachineQueryResponse {
  id: number,
  name: string,
  type: MachineType,
  userId: number,
  user: User,
}