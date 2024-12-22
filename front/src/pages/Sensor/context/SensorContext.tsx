import { createContext } from 'react'
import { SensorContextType } from '../types'

export const SensorContext = createContext<SensorContextType>({} as SensorContextType)
