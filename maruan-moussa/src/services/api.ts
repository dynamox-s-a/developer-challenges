import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const authData = localStorage.getItem("authData");
  if (authData) {
    const { token } = JSON.parse(authData);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});