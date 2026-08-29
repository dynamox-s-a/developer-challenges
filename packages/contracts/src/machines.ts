import { z } from "zod";

import { idSchema, isoDateTimeSchema, nameSchema } from "./common.js";

export const machineTypeSchema = z.enum(["Pump", "Fan"]);

export const createMachineRequestSchema = z
  .object({
    name: nameSchema,
    type: machineTypeSchema,
  })
  .strict();

export const updateMachineRequestSchema = z
  .object({
    name: nameSchema.optional(),
    type: machineTypeSchema.optional(),
  })
  .strict()
  .refine((value) => value.name !== undefined || value.type !== undefined, {
    message: "Provide at least one of name or type",
  });

export const machineSchema = z.object({
  id: idSchema,
  name: nameSchema,
  type: machineTypeSchema,
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
});

export const machineListResponseSchema = z.object({
  items: z.array(machineSchema),
});

export type MachineType = z.infer<typeof machineTypeSchema>;
export type CreateMachineRequest = z.infer<typeof createMachineRequestSchema>;
export type UpdateMachineRequest = z.infer<typeof updateMachineRequestSchema>;
export type Machine = z.infer<typeof machineSchema>;
export type MachineListResponse = z.infer<typeof machineListResponseSchema>;
