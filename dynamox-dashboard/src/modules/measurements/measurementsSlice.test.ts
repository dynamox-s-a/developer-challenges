import { describe, expect, it } from 'vitest'
import {
  loadMeasurements,
  loadMeasurementsFailure,
  loadMeasurementsSuccess,
  measurementsReducer,
} from './measurementsSlice'
import { measurementsMock } from './measurementsMock'

describe('measurementsReducer', () => {
  it('starts with an empty measurements list', () => {
    expect(measurementsReducer(undefined, { type: '' })).toEqual({
      data: [],
      error: null,
      isLoading: false,
    })
  })

  it('sets loading state when measurements are requested', () => {
    expect(measurementsReducer(undefined, loadMeasurements())).toEqual({
      data: [],
      error: null,
      isLoading: true,
    })
  })

  it('stores measurements on success', () => {
    expect(
      measurementsReducer(undefined, loadMeasurementsSuccess(measurementsMock)),
    ).toEqual({
      data: measurementsMock,
      error: null,
      isLoading: false,
    })
  })

  it('stores the error message on failure', () => {
    expect(
      measurementsReducer(undefined, loadMeasurementsFailure('Request failed')),
    ).toEqual({
      data: [],
      error: 'Request failed',
      isLoading: false,
    })
  })
})
