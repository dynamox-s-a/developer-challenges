import { describe, expect, it } from 'vitest'
import { sortByKey } from './sorting'

type Row = {
  name: string
  type: string
  sensor: string | null
}

describe('sorting', () => {
  const rows: Row[] = [
    { name: 'Bomba 2', type: 'Pump', sensor: 'HF+' },
    { name: 'Bomba 1', type: 'Pump', sensor: null },
    { name: 'Ventilador', type: 'Fan', sensor: 'TcAg' }
  ]

  it('ordena por string asc', () => {
    const sorted = sortByKey(rows, 'name', 'asc')
    expect(sorted.map((r) => r.name)).toEqual(['Bomba 1', 'Bomba 2', 'Ventilador'])
  })

  it('ordena por string desc', () => {
    const sorted = sortByKey(rows, 'name', 'desc')
    expect(sorted.map((r) => r.name)).toEqual(['Ventilador', 'Bomba 2', 'Bomba 1'])
  })

  it('coloca null no final (asc)', () => {
    const sorted = sortByKey(rows, 'sensor', 'asc')
    // null vai pro fim
    expect(sorted[sorted.length - 1].sensor).toBeNull()
  })
})
