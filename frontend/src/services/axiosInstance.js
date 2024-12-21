import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://your-production-url.com"
      : "http://localhost:3001"),
});

export default axiosInstance;
