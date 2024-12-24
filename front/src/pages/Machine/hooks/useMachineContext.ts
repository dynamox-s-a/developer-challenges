import { useContext } from 'react'
import { MachineContext } from '../context'
import { MachineContextType } from '../types'

export function useMachineContext (): MachineContextType {
  const context = useContext(MachineContext)

  return context
}
