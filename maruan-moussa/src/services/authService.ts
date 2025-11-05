import { api } from "./api"


export const loginUser = async (email: string, password: string) => {
    const { data }  = await api.get("/users", {
        params: {email, password}
    });

    if (!data.length) throw new Error("Credenciais inválidas");

    const user = data[0];
    const token = btoa(`{user.email}:${Date.now()}`);

    return {user, token};
}