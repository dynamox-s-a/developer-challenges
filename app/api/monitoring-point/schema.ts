import { z } from "zod";

const allowedSensors = ["tcag", "tcas", "hf+"];

function sensorValidation(sensor: string) {
  let sensorIsValidated = false;

  allowedSensors.map((allowedSensor) => {
    if (sensor === allowedSensor) sensorIsValidated = true;
  });

  if (!sensorIsValidated) return false;
  return sensor;
}

const schema = z.object({
  machineId: z.number(),
  name: z.string().min(1),
  sensor: z
    .string()
    .toLowerCase()
    .refine(sensorValidation, {
      message:
        "Invalid monitoring point sensor. Sensor needs to be one of these: " +
        allowedSensors.slice(0, -1).join(", ") +
        " or " +
        allowedSensors.slice(-1),
    }),
});

export { schema };
