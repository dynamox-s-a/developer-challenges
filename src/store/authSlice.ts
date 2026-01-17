import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// defino a estrutura do estado de autenticação
interface AuthState {
  isAuthenticated: boolean;
  userEmail: string | null;
}

// recupero os dados de autenticação salvos no localStorage, se existirem
const savedAuth = localStorage.getItem('auth_data');

// configuro o estado inicial: se houver dados salvos, eu os uso; senão, eu começo com autenticação inativa
const initialState: AuthState = savedAuth 
  ? JSON.parse(savedAuth) 
  : { isAuthenticated: false, userEmail: null };

// crio o slice de autenticação com as ações de login e logout
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // faço login salvando o email e marcando como autenticado
    login: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = true;
      state.userEmail = action.payload;
      // persisto os dados no localStorage para manter a sessão entre recargas
      localStorage.setItem('auth_data', JSON.stringify(state));
    },
    // faço logout limpando os dados de autenticação
    logout: (state) => {
      state.isAuthenticated = false;
      state.userEmail = null;
      // removo os dados do localStorage para encerrar a sessão
      localStorage.removeItem('auth_data');
    },
  },
});

// exporto as ações para usar em outros componentes
export const { login, logout } = authSlice.actions;

// exporto o reducer para configurar no store
export default authSlice.reducer;