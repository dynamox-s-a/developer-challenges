import { store } from "../features/store";
import { logout } from "../features/auth-slice";
import { api } from "./api";

// Intercepta todas as requisições e adiciona o token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Intercepta respostas e trata erros globais
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Se o erro for 401 (Unauthorized), desloga o usuário.
    if (error.response?.status === 401) {
      // Despacha a ação de logout que cuidará de limpar o estado e redirecionar.
      // Usamos um `setTimeout` para garantir que o dispatch ocorra fora do ciclo de vida da promise atual.
      setTimeout(() => store.dispatch(logout()), 100);
    }
    return Promise.reject(error);
  }
);
