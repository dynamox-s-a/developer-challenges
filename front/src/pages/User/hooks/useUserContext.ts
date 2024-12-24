import { useContext } from 'react'
import { UserContext } from '../context'
import { UserContextType } from '../types'

export function useUserContext (): UserContextType {
  const context = useContext(UserContext)

  return context
}
