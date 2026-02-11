import { z } from 'zod'

const SENSOR_UNIQUE_ID_REGEX = /^[A-Z]{6}-\d{3}$/

export const sensorCreateSchema = z
  .object({
    sensorUniqueId: z
      .string()
      .trim()
      .transform((v) => v.toUpperCase())
      .refine((v) => SENSOR_UNIQUE_ID_REGEX.test(v), {
        message:
          'sensorUniqueId must match pattern AAAAAA-999 (6 uppercase letters, hyphen, 3 digits)'
      }),
    model: z.enum(['TcAg', 'TcAs', 'HF_PLUS']),
    monitoringPointUuid: z.uuid()
  })
  .strict()

export const sensorUpdateSchema = z
  .object({
    sensorUniqueId: z
      .string()
      .trim()
      .transform((v) => v.toUpperCase())
      .refine((v) => SENSOR_UNIQUE_ID_REGEX.test(v), {
        message:
          'sensorUniqueId must match pattern AAAAAA-999 (6 uppercase letters, hyphen, 3 digits)'
      })
      .optional(),
    model: z.enum(['TcAg', 'TcAs', 'HF_PLUS']).optional()
  })
  .strict()

export const uuidParamSchema = z.object({
  uuid: z.uuid()
})
