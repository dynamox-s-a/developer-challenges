import { z } from "zod";

const allowedTypes = ["fan", "pump"];

function typeValidation(type: string) {
  let typeIsValidated = false;

  allowedTypes.map((allowedType) => {
    if (type === allowedType) typeIsValidated = true;
  });

  if (!typeIsValidated) return false;
  return type;
}

const schema = z.object({
  name: z.string().min(1),
  type: z
    .string()
    .toLowerCase()
    .refine(typeValidation, {
      message:
        "Invalid machine type. Type needs to be one of these: " +
        allowedTypes.slice(0, -1).join(", ") +
        " or " +
        allowedTypes.slice(-1),
    }),
});

export { schema };
