import { User } from "../types/user";
import { api } from "./api";

export class LoginService {
    async login(data: User) {
        try {
            const res = await api.post("/auth/login", data);
            return res.data;
        } catch (error: any) {
            if (error.status == 400) {
                throw new Error("Credentials are invalid!");
            }
        }
    }

    async logout() {
        try {
            await api.get("/auth/logout");

        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}