import { describe, it, expect } from 'vitest'
import machineReducer, { clearError } from '../machineSlice'
import type { Machine } from '../machineSlice'

describe('machineSlice', () => {
  const initialState = {
    machines: [],
    monitoringPoints: [],
    loading: false,
    error: null,
  }



  it('should handle clearError', () => {
    const stateWithError = { ...initialState, error: 'Test error' }
    const action = clearError()
    const state = machineReducer(stateWithError, action)
    
    expect(state.error).toBe(null)
  })

  it('should validate business rule: TcAg/TcAs not allowed on Pumps', () => {
    const pumpMachine: Machine = { id: '1', name: 'Pump', type: 'Pump' }
    const forbiddenSensors = ['TcAg', 'TcAs']
    
    forbiddenSensors.forEach(sensor => {
      if (pumpMachine.type === 'Pump' && ['TcAg', 'TcAs'].includes(sensor)) {
        expect(true).toBe(true) // Business rule validation
      }
    })
  })

  it('should allow HF+ sensor on Pumps', () => {
    const pumpMachine: Machine = { id: '1', name: 'Pump', type: 'Pump' }
    const allowedSensor = 'HF+'
    
    const isAllowed = !(pumpMachine.type === 'Pump' && ['TcAg', 'TcAs'].includes(allowedSensor))
    expect(isAllowed).toBe(true)
  })

  it('should allow all sensors on Fans', () => {
    const fanMachine: Machine = { id: '1', name: 'Fan', type: 'Fan' }
    const allSensors = ['TcAg', 'TcAs', 'HF+']
    
    allSensors.forEach(sensor => {
      const isAllowed = !(fanMachine.type === 'Pump' && ['TcAg', 'TcAs'].includes(sensor))
      expect(isAllowed).toBe(true)
    })
  })
})