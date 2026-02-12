import z from 'zod'
import { createResponseSchema } from '@/utils/createResponse'

export const MachineTypeSchema = z.enum(['Pump', 'Fan'])

export const CreateMachineSchema = z.object({
  Name: z.string().min(1).max(30),
  Type: MachineTypeSchema,
})

export const UpdateMachineSchema = CreateMachineSchema.partial()

export const MachinePresenterSchema = z.object({
  _id: z.string(),
  Name: z.string(),
  Type: MachineTypeSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export const MachinesPresentersSchema = z.array(MachinePresenterSchema)

export const MachineResponseSchema = createResponseSchema(
  MachinePresenterSchema,
)

export type MachinesPresenters = z.infer<typeof MachinesPresentersSchema>
export type MachinePresenter = z.infer<typeof MachinePresenterSchema>
export type MachineType = z.infer<typeof MachineTypeSchema>
export type CreateMachineDto = z.infer<typeof CreateMachineSchema>
export type UpdateMachineDto = Partial<CreateMachineDto>
export type MachineResponse = z.infer<typeof MachineResponseSchema>
