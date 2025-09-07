import { combineReducers } from '@reduxjs/toolkit'
import data from '@/domain/data/reducer'

const rootReducer = combineReducers({ data })
export type RootState = ReturnType<typeof rootReducer>
export default rootReducer
