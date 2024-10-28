import axios from "axios";
import CryptoJS from "crypto-js";
import dotenv from "dotenv";

dotenv.config();

export default function AxiosAuth() {
  const token = localStorage.getItem("token");

  const axiosInstance = axios.create({
    baseURL: "https://dynamox-fullstack-test-production.up.railway.app/auth",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  axiosInstance.interceptors.request.use((config) => {
    if (config.data) {
      const secretKey = process.env.SECRET_CRYPTO_KEY || "secret";
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(config.data.password),
        secretKey
      ).toString();
      config.data = {
        email: config.data.email,
        password: encryptedData,
      };
    }
    return config;
  });

  return axiosInstance;
}
