import { describe, it, expect } from 'vitest'
import { getMeasuresFailiure, getMeasuresFetch, getMeasuresSuccess, measuresSlice ,setScope } from './measuresSlice'
import { Measure } from '../../@types/types'
import db from '../../../db.json'

describe('measures slice', () => {

  it('should set isLoading to true when getMeasuresFetch is dispatched', () => {
    const initialState = measuresSlice.getInitialState()

    const state = measuresSlice.reducer(initialState, getMeasuresFetch())

    expect(state.isLoading).toEqual(true)
  })

  it('should set isLoading to false and update data when getMeasuresSuccess is dispatched', () => {
    const initialState = measuresSlice.getInitialState()
    const measuresData: Measure[] = db.data
  
    const state = measuresSlice.reducer(initialState, getMeasuresSuccess(measuresData))

    expect(state.isLoading).toEqual(false)
    expect(state.data).toEqual(measuresData)
  })

  it('should set isLoading to true when getMeasuresFetch is dispatched', () => {
    const initialState = measuresSlice.getInitialState()
    const state = measuresSlice.reducer(initialState, getMeasuresFailiure())

    expect(state.isLoading).toEqual(false)
  })

  it('should set scope in data chart', () => {
    const initialState = measuresSlice.getInitialState()

    const action = setScope({ type: 'aceleration', selectScope: 'lastMonth' })
    const state = measuresSlice.reducer(initialState, action)

    expect(state.scope.aceleration).toEqual('lastMonth')
  })

  it('should set scope for all types on responsiveChange', () => {
    const initialState = measuresSlice.getInitialState()

    const action = setScope({ type: 'responsiveChange', selectScope: 'lastMonth' })
    const state = measuresSlice.reducer(initialState, action)

    expect(state.scope.aceleration).toEqual('lastMonth')
    expect(state.scope.velocity).toEqual('lastMonth')
    expect(state.scope.temperature).toEqual('lastMonth')
  })
})
