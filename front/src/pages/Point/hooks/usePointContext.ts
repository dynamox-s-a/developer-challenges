import { useContext } from 'react'
import { PointContext } from '../context'
import { PointContextType } from '../types'

export function usePointContext (): PointContextType {
  const context = useContext(PointContext)

  return context
}
