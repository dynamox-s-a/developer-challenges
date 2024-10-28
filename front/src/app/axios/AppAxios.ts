import axios from "axios";

export default function AppAxios() {
  const token = localStorage.getItem("token");
  return axios.create({
    baseURL: `https://dynamox-fullstack-test-production.up.railway.app`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
