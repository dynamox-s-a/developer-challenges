import axios from "axios";

export const http = axios.create({ baseURL: import.meta.env.VITE_API_URL });

http.interceptors.request.use(
  // adiciona o token em todas as requisições que não sejam de login
  (config) => {
    const token = localStorage.getItem("jwt");
    // Verifica se a URL não é a de login
    if (token && config.url !== "/login/") {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("jwt");
      window.location.href = "/";
      console.error("Autenticação expirada ou inválida");
    }
    return Promise.reject(error);
  },
);
