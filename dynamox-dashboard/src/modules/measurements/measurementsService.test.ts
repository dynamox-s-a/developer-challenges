import { afterEach, describe, expect, it, vi } from 'vitest'
import { measurementsMock } from './measurementsMock'
import { fetchMeasurements } from './measurementsService'

describe('fetchMeasurements', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('returns measurements from the API', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(measurementsMock),
      ok: true,
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(fetchMeasurements()).resolves.toEqual(measurementsMock)
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/measurements'),
    )
  })

  it('throws an error when the API request fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
      }),
    )

    await expect(fetchMeasurements()).rejects.toThrow(
      'Unable to fetch measurements',
    )
  })
})
