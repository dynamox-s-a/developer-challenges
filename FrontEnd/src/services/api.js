import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // pega o token salvo
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // envia token no header
  }
  return config;
});

export default api;
