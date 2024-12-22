import { useContext } from 'react'
import { SensorContext } from '../context'
import { SensorContextType } from '../types'

export function useSensorContext (): SensorContextType {
  const context = useContext(SensorContext)

  return context
}
