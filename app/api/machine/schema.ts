import { z } from "zod";

function typeValidation(type: string) {
  const allowedTypes = ["fan", "pump"];
  let typeIsValidated = false;

  allowedTypes.map((allowedType) => {
    if (type === allowedType) typeIsValidated = true;
  });

  if (!typeIsValidated) return false;
  return type;
}

const postSchema = z.object({
  name: z.string().min(3),
  type: z.string().toLowerCase().refine(typeValidation, {
    message: "Invalid machine type. Machine type needs to be 'fan' or 'pump'.",
  }),
  userId: z.number(),
});

export { postSchema };

const putSchema = z.object({
  name: z.string().min(3),
  type: z.string().toLowerCase().refine(typeValidation, {
    message: "Invalid machine type. Machine type needs to be 'fan' or 'pump'.",
  }),
});

export { putSchema };
