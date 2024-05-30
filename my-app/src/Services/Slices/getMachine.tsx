import { createSlice } from "@reduxjs/toolkit";
import services from "../services";
import { IMachineState } from "../../Types/Machine";

const initialState: IMachineState = {
  data: [{
    machine: '',
    point: '',
    rpm: '',
    diff: '',
    time: '',
  }],
  loading: false,
  error: false,
};

const GetMachineSlice = createSlice({
  name: "getMachine",
  initialState,
  reducers: {
    getMachine: (state: IMachineState) => {
      state.loading = true;
      state.error = false;
      state.data = [{
        machine: '',
        point: '',
        rpm: '',
        diff: '',
        time: '',
      }];
    },
    getMachineSuccess: (state: IMachineState, action: any) => {
      state.loading = false;
      state.error = false;
      state.data = action.payload;
    },
    getMachineFailure: (state: IMachineState) => {
      state.loading = false;
      state.error = true;
      state.data = [{
        machine: '',
        point: '',
        rpm: '',
        diff: '',
        time: '',
      }];
    },
  },
});

export const { getMachine, getMachineSuccess, getMachineFailure } =
  GetMachineSlice.actions;

export default GetMachineSlice.reducer;

export const fetchGetMachine =
  () =>
    async (
      dispatch: (arg0: {
        payload: any;
        type:
        | "getMachine/getMachine"
        | "getMachine/getMachineSuccess"
        | "getMachine/getMachineFailure";
      }) => void
    ) => {
      dispatch(getMachine());
      try {
        const response = await services.getMachine();
        dispatch(getMachineSuccess(response.data));
      } catch (err) {
        dispatch(getMachineFailure());
      }
    };