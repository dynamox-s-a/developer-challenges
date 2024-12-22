import { useContext } from 'react'
import { HomeContext } from '../context'
import { HomeContextType } from '../types'

export function useHomeContext (): HomeContextType {
  const context = useContext(HomeContext)

  return context
}
