import { z } from "zod";

export const machineSchema = z.object({
  name: z.string().nonempty("Name is required"),
  serialNumber: z.string().nonempty("Serial Number is required"),
  machineTypeId: z.string().nonempty("Machine Type is required"),
  description: z.string().optional(),
});