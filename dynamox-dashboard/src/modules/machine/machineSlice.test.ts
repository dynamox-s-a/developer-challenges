import { describe, expect, it } from 'vitest'
import {
  loadMachine,
  loadMachineFailure,
  loadMachineSuccess,
  machineReducer,
} from './machineSlice'
import { machineMock } from './machineMock'

describe('machineReducer', () => {
  it('starts with no machine data', () => {
    expect(machineReducer(undefined, { type: '' })).toEqual({
      data: null,
      error: null,
      isLoading: false,
    })
  })

  it('sets loading state when machine data is requested', () => {
    expect(machineReducer(undefined, loadMachine())).toEqual({
      data: null,
      error: null,
      isLoading: true,
    })
  })

  it('stores machine data on success', () => {
    expect(machineReducer(undefined, loadMachineSuccess(machineMock))).toEqual({
      data: machineMock,
      error: null,
      isLoading: false,
    })
  })

  it('stores the error message on failure', () => {
    expect(machineReducer(undefined, loadMachineFailure('Request failed'))).toEqual({
      data: null,
      error: 'Request failed',
      isLoading: false,
    })
  })
})
