import { createContext } from 'react'
import { HomeContextType } from '../types'

export const HomeContext = createContext<HomeContextType>({} as HomeContextType)
