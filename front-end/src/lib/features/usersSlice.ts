import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state
export interface UsersState {
    isLogged: boolean;
    email: string;
    password: string;
    id: number;

}
  
// Define the initial state using that type
const initialState: UsersState = {
    email: '',
    password: '',
    id: 0,
    isLogged: false,
}

export const usersSlice = createSlice({
  name: 'points',
  initialState,
  reducers: {
    login: (state, action) => {
        state.id = action.payload.id;
        state.email = action.payload.email;
        state.password = action.payload.password;
        state.isLogged = true;
    },
    logoff: state => {
        state = initialState;
    },
  }
})

// Action creators are generated for each case reducer function
export const { login, logoff } = usersSlice.actions

export default usersSlice.reducer