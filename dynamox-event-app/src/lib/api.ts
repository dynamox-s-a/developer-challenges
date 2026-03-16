import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});


//intercptor para adicionar o token ao header de todas as reqs
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// interceptor para validar token. Desloga automaticamente caso token seja inválido
api.interceptors.response.use(
  (response) => response,
  (error) => {

    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;