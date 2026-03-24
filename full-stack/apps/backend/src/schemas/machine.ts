import { z } from "zod";

export const machineTypeSchema = z.enum(["Pump", "Fan"]);

export const createMachineSchema = z.object({
  name: z.string().min(1).max(120),
  type: machineTypeSchema,
});

export const updateMachineSchema = createMachineSchema.partial();