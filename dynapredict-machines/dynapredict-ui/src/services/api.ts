import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5023/api", // ajuste se seu backend estiver em outra porta
});

export default api;
