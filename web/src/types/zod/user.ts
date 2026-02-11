import z from 'zod'

const CreateUserSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
})

export type CreateUserDto = z.infer<typeof CreateUserSchema>
