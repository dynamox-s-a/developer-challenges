import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5023/api",
});

export default api;
