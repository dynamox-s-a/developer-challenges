import { describe, expect, it } from 'vitest'
import { paginate, pageCount } from './pagination'

describe('pagination', () => {
  it('retorna o slice correto para uma página', () => {
    const items = Array.from({ length: 12 }, (_, i) => i + 1) // 1..12
    const pageSize = 5

    expect(paginate(items, 0, pageSize)).toEqual([1, 2, 3, 4, 5])
    expect(paginate(items, 1, pageSize)).toEqual([6, 7, 8, 9, 10])
    expect(paginate(items, 2, pageSize)).toEqual([11, 12])
  })

  it('calcula número de páginas corretamente (mínimo 1)', () => {
    expect(pageCount(0, 5)).toBe(1)
    expect(pageCount(1, 5)).toBe(1)
    expect(pageCount(5, 5)).toBe(1)
    expect(pageCount(6, 5)).toBe(2)
    expect(pageCount(12, 5)).toBe(3)
  })
})
