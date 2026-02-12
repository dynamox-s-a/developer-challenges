import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email('Formato de email inválido'),
  password: z.string().min(1, 'Senha é obrigatória')
})

export const registerSchema = z.object({
  email: z.email('Formato de email inválido'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
  name: z.string().min(1, 'Nome é obrigatório')
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
