import { afterEach, describe, expect, it, vi } from 'vitest'
import { machineMock } from './machineMock'
import { fetchMachine } from './machineService'

describe('fetchMachine', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('returns machine data from the API', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(machineMock),
      ok: true,
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(fetchMachine()).resolves.toEqual(machineMock)
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/machine'))
  })

  it('throws an error when the API request fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
      }),
    )

    await expect(fetchMachine()).rejects.toThrow('Unable to fetch machine data')
  })
})
