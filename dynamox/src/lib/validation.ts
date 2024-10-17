import { z } from "zod";

export const MachineFormValidation = z.object({
  name: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  type: z.enum(["Fan", "Pump"], { message: "Type is required!" }),
});