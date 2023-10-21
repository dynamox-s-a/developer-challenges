import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define o estado do usuário
interface User {
  id: number;
  nome: string;
  sobrenome: string;
  código: string;
  setor: string;
  email: string;
  senha: string;
  telefone: string;
}

const initialUser: User = {
  id: 1,
  nome: 'Seu Nome',
  sobrenome: 'Seu Sobrenome',
  código: '12345',
  setor: 'RH',
  email: 'seuemail@example.com',
  senha: 'suasenha',
  telefone: '123-456-7890',
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
