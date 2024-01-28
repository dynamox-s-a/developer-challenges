import { z } from "zod";

const postSchema = z.object({
  email: z.string().email(),
  name: z.string().min(3),
  password: z.string().min(5),
});

export { postSchema };
