import axios, { AxiosError } from 'axios';
import { parseCookies } from 'nookies';

export function setupApiClient(context = undefined){
    let cookies = parseCookies(context);
    const api = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        headers: {
            Authorization: `Bearer ${cookies.token}`
        }

    });

    api.interceptors.response.use(response => {
        return response;
    }, (error: AxiosError) => {

        return Promise.reject(error);
    })

    return api;
}