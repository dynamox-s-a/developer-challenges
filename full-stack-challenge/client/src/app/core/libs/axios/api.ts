import axios from 'axios';
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

// api.interceptors.request.use((config) => {
//   if (typeof localStorage !== "undefined") {
//     let credentials: any = localStorage.getItem(AUTH_KEY)

//     if (credentials) {
//       credentials = JSON.parse(credentials)
//       if (credentials.jwt) {
//         config.headers.Authorization = `Bearer ${credentials.jwt}`
//       }
//     }
//   }
//   return config
// })
