import { z } from 'zod';

export type CreateSessionDto = {
  email: string;
  password: string;
}

export const createSessionDto = z.object({
  email: z
    .string()
    .email()
    .min(1, { message: 'The email has to be filled' }),
  password: z
    .string()
    .min(1, { message: 'The password has to be filled' })
})
