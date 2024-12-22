import { createContext } from 'react'
import { LoginContextType } from '../types'

export const LoginContext = createContext<LoginContextType>({} as LoginContextType)
