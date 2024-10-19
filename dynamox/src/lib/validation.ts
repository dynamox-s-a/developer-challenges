import { z } from "zod";

export const MachineFormValidation = z.object({
  id: z.coerce.number().optional(),
  name: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  type: z.enum(["Fan", "Pump"], { message: "Type is required!" }),
});

export type MachineFormValidationSchema = z.infer<typeof MachineFormValidation>;

export const MonitoringPointFormValidation = z.object({
  name: z.string().min(1, "Name is required"),
  model: z.enum(["TcAg", "TcAs", "HF+"], {
    message: "Sensor Model Type is required!",
  }),
});
