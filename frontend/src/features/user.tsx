import { createSlice } from "@reduxjs/toolkit";

const initialState = { name: "", email: "", userId: "", sessionId: "" };

//Reducer configuration
export const userSlice = createSlice({
    name: "user",
    initialState: { value: initialState },
    reducers: {
        login: (state, action) => {            
            state.value = action.payload;
        },
        logout: (state) => {
            state.value = initialState;
        }
    }
});

//Reducer actions
export const { login, logout } = userSlice.actions;

export default userSlice.reducer;