import { createAppSlice } from "../../app/createAppSlice"
import { fetchDataBySensor } from "../../controllers/sensorController"
import type { ApiResponseBySensor } from "../../@types"

export interface SensorSliceState {
  value: ApiResponseBySensor
  status: "initial" | "idle" | "loading" | "failed"
}

const initialState: SensorSliceState = {
  value: {} as ApiResponseBySensor,
  status: "initial",
}

// If you are not using async thunks you can use the standalone `createSlice`.
export const sensorSlice = createAppSlice({
  name: "sensor",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: create => ({
    // The function below is called a thunk and allows us to perform async logic. It
    // can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
    // will call the thunk with the `dispatch` function as the first argument. Async
    // code can then be executed and other actions can be dispatched. Thunks are
    // typically used to make async requests.
    getByIdAsync: create.asyncThunk(
      async (id: number) => {
        const response = await fetchDataBySensor(id)
        // The value we return becomes the `fulfilled` action payload
        return response as ApiResponseBySensor
      },
      {
        pending: state => {
          state.status = "loading"
        },
        fulfilled: (state, action) => {
          state.status = "idle"
          state.value = action.payload
        },
        rejected: state => {
          state.status = "failed"
        },
      },
    ),
  }),
  // You can define your selectors here. These selectors receive the slice
  // state as their first argument.
  selectors: {
    selectSensor: sensor => sensor.value,
    selectStatus: sensor => sensor.status,
  },
})

// Action creators are generated for each case reducer function.
export const { getByIdAsync } = sensorSlice.actions

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectSensor, selectStatus } = sensorSlice.selectors
