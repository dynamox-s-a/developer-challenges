import { z } from "zod";

const schema = z.object({
  machineId: z.number().min(1),
  name: z.string().min(1),
  sensorId: z.number().min(1).max(3),
});

export { schema };
