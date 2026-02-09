import { cookies } from 'next/headers'
import { TokenSchema } from './types'

export async function getUserSession(): Promise<{ token: string } | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('user')
  const result = TokenSchema.safeParse(token)
  if (!result.success) return null
  return result.data
}
