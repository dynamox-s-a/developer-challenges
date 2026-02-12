'use server'

import { cookies } from 'next/headers'
import { TokenSchema } from './validation'

export async function getUserSession(): Promise<string | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('user')
  const result = TokenSchema.safeParse(token)
  if (!result.success) return null
  return result.data.value
}

export async function endUserSession() {
  const cookieStore = await cookies()
  cookieStore.delete('user')
}
