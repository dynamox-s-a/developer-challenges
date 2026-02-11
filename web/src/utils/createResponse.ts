import z from 'zod'

export const createResponseSchema = <TSchema extends z.ZodTypeAny>(
  dataSchema: TSchema,
) =>
  z.object({
    success: z.boolean(),
    data: z.union([dataSchema, z.array(dataSchema)]).optional(),
    message: z.string(),
  })
