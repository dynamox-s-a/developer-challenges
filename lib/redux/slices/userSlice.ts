import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define o estado do usuário
interface User {
  id: number;
  nome: string;
  sobrenome: string;
  código: string;
  setor: string;
  email: string;
  password: string;
  telefone: string;
  foto: string;
}

const initialUser: User = {
  id: 0,
  nome: '',
  sobrenome: '',
  código: '',
  setor: '',
  email: '',
  password: '',
  telefone: '',
  foto: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState: initialUser,
  reducers: {
    updateUser: (state, action: PayloadAction<User>) => {
      // Atualize os dados do usuário com os dados fornecidos
      return { ...state, ...action.payload };
    },
  },
});

export const { updateUser } = userSlice.actions;

export const selectUser = (state: { user: User }) => state.user;

export default userSlice.reducer;

export type { User }; // Exporta o tipo User
