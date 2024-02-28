import { z } from 'zod';

export type UpdateUserDto = {
  email?: string;
  name?: string;
  password?: string;
  oldPassword?: string;
}

export const updateUserDto = z.object({
  email: z
    .string()
    .min(1, {message: 'The email has to be filled'})
    .email('The email is not valid')
    .optional(),
  name: z.string().optional(),
  oldPassword: z.string().optional(),
  password: z
    .string()
    .min(8, {message: 'The password has to be at least 8 characters long'})
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
      'The password must contain at least 1 lowercase letter, 1 uppercase letter and 1 number'
    )
    .optional(),
});
