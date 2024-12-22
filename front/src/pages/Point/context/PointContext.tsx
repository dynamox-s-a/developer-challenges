import { createContext } from 'react'
import { PointContextType } from '../types'

export const PointContext = createContext<PointContextType>({} as PointContextType)
