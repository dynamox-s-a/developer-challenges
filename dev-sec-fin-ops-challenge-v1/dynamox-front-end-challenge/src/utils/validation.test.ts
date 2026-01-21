import { describe, expect, it } from 'vitest'
import { isSensorAllowedForMachine, assertSensorAllowed } from './validation'

describe('validation - sensor rules', () => {
  it('deve bloquear TcAg e TcAs para máquinas Pump', () => {
    expect(isSensorAllowedForMachine('Pump', 'TcAg')).toBe(false)
    expect(isSensorAllowedForMachine('Pump', 'TcAs')).toBe(false)
  })

  it('deve permitir HF+ para máquinas Pump', () => {
    expect(isSensorAllowedForMachine('Pump', 'HF+')).toBe(true)
  })

  it('deve permitir qualquer sensor para máquinas Fan', () => {
    expect(isSensorAllowedForMachine('Fan', 'TcAg')).toBe(true)
    expect(isSensorAllowedForMachine('Fan', 'TcAs')).toBe(true)
    expect(isSensorAllowedForMachine('Fan', 'HF+')).toBe(true)
  })

  it('assertSensorAllowed deve lançar erro quando proibido', () => {
    expect(() => assertSensorAllowed('Pump', 'TcAg')).toThrow()
  })
})
