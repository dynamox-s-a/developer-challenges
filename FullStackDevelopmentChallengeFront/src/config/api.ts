import axios from "axios"

export const api =axios.create({
    baseURL: 'https://localhost:7024/Machine'
});