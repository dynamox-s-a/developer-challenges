import { createAction } from '@reduxjs/toolkit'
import { PreparedSeries } from './types'

export const dataFetchRequested = createAction('data/fetchRequested')
export const dataFetchSucceeded = createAction<{
  acceleration: PreparedSeries[]
  velocity: PreparedSeries[]
  temperature: PreparedSeries[]
}>('data/fetchSucceeded')
export const dataFetchFailed = createAction<string>('data/fetchFailed')
