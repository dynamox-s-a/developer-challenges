import axios from "axios";
import { authClient } from "./auth-client";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // Evita loop infinito
//     if (error.response?.status === 401) {
//       // se a requisição que falhou já era a de refresh-token, não tente dar refresh de novo
//       if (originalRequest?.url?.includes("/auth/refresh-token")) {
//         authClient.logout();
//         //quero um stopt de 30 segundos

//         window.location.href = "/login"; // Redireciona para login
//         return Promise.reject(error);
//       }

//       if (!originalRequest._retry) {
//         originalRequest._retry = true;

//         const result = await authClient.refreshToken();

//         console.log("Refresh token result:", result);
//         if (result.token) {
//           originalRequest.headers.Authorization = `Bearer ${result.token}`;
//           return api(originalRequest);
//         } else {
//           authClient.logout();
//           window.location.href = "/login"; // Redireciona para login
//         }
//       }
//     }
//     return Promise.reject(error);
//   }
// );
