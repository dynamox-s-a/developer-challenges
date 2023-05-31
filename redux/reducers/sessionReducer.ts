import { createSlice } from "@reduxjs/toolkit";
import { Session } from "lib/auth/auth";

const session: Session | null = null;
interface SessionState {
  session: Session | null;
}
const initialState: SessionState = { session };
export const sessionSlice = createSlice({
  name: "navState",
  initialState,
  reducers: {
    setSession: (state, action) => {
      state.session = action.payload;
    },
    clearSession: (state) => {
      state.session = initialState.session;
    },
  },
});

export const { setSession, clearSession } = sessionSlice.actions;
export default sessionSlice.reducer;
