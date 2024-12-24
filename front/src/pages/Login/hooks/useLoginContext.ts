import { useContext } from 'react'
import { LoginContext } from '../context'
import { LoginContextType } from '../types'

export function useLoginContext (): LoginContextType {
  const context = useContext(LoginContext)

  return context
}
