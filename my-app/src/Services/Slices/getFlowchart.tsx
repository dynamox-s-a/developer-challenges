import { createSlice } from "@reduxjs/toolkit";
import services from "../services";
import { IFlowchartState } from "../../Types/Flowchart";

const initialState: IFlowchartState = {
  data: {
    name: '',
    data: []
  },
  loading: false,
  error: false,
};

const GetFlowchartSlice = createSlice({
  name: "getFlowchart",
  initialState,
  reducers: {
    getFlowchart: (state: IFlowchartState) => {
      state.loading = true;
      state.error = false;
      state.data = {
        name: '',
        data: []
      };
    },
    getFlowchartSuccess: (state: IFlowchartState, action: any) => {
      state.loading = false;
      state.error = false;
      state.data = action.payload;
    },
    getFlowchartFailure: (state: IFlowchartState) => {
      state.loading = false;
      state.error = true;
      state.data = {
        name: '',
        data: []
      };
    },
  },
});

export const { getFlowchart, getFlowchartSuccess, getFlowchartFailure } =
  GetFlowchartSlice.actions;

export default GetFlowchartSlice.reducer;

export const fetchGetFlowchart =
  () =>
    async (
      dispatch: (arg0: {
        payload: any;
        type:
        | "getFlowchart/getFlowchart"
        | "getFlowchart/getFlowchartSuccess"
        | "getFlowchart/getFlowchartFailure";
      }) => void
    ) => {
      dispatch(getFlowchart());
      try {
        const response = await services.getFlowchart();
        dispatch(getFlowchartSuccess(response.data));
      } catch (err) {
        dispatch(getFlowchartFailure());
      }
    };