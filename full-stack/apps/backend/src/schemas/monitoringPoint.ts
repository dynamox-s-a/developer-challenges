import { z } from "zod";

export const sensorModelSchema = z.enum(["TcAg", "TcAs", "HF_plus"]);

export const createMonitoringPointSchema = z.object({
  name: z.string().min(1).max(120),
  sensor: z.object({
    uniqueId: z.string().min(1).max(80),
    model: sensorModelSchema,
  }),
});

export const updateMonitoringPointSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  sensor: z
    .object({
      uniqueId: z.string().min(1).max(80).optional(),
      model: sensorModelSchema.optional(),
    })
    .optional(),
});