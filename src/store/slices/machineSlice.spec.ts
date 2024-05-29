import { describe, it, expect } from 'vitest'
import { getMachineDataFailure, getMachineDataFetch, getMachineDataSuccess, MachineItem, machineSlice } from './machineSlice'
import db from '../../../db.json'

describe('machineSlice', () => {
  it('should set isLoading to true', () => {
    const initialState = machineSlice.getInitialState()

    const state = machineSlice.reducer(initialState, getMachineDataFetch())

    expect(state.isLoading).toEqual(true)
  })

  it('should set isLoading to false and updtate data when getMachineDataFetch is dispatched', () => {
    const initialState = machineSlice.getInitialState()
    const machineData: MachineItem[] = db.machine

    const state = machineSlice.reducer(initialState, getMachineDataSuccess(machineData))

    expect(state.isLoading).toEqual(false)
    expect(state.data).toEqual(machineData)
  })

  it('should set isLoading to false', () => {
    const initialState = machineSlice.getInitialState()
    
    const state = machineSlice.reducer(initialState, getMachineDataFailure())

    expect(state.isLoading).toEqual(false)
  })
})