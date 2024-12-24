import { createContext } from 'react'
import { MachineContextType } from '../types'

export const MachineContext = createContext<MachineContextType>({} as MachineContextType)
