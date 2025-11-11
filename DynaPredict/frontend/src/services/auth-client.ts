import { api } from "./api";

export interface UserParams {
  email: string;
  password: string;
}

class AuthClient {
  async createAccount({
    email,
    password,
  }: UserParams): Promise<{ error?: string }> {
    try {
      const res = await api.post("/auth/create-account", { email, password });
      console.log(res.data);
      return {};
    } catch (err: any) {
      return { error: err.response?.data?.detail || "Erro ao criar conta." };
    }
  }

  async login({ email, password }: UserParams): Promise<{
    
    access_token?: string;
    refresh_token?: string;
    error?: string;
  }> {
    try {
      const res = await api.post("/auth/login", { email, password });
      console.log("res.data:", res.data);
      const { access_token } = res.data;
      const { refresh_token } = res.data;
      localStorage.setItem("refresh_token", refresh_token);
      localStorage.setItem("access_token", access_token);
      return { access_token, refresh_token };
    } catch (err: any) {
      return { error: err.response?.data?.detail || "Credenciais inválidas." };
    }
  }

  async refreshToken(): Promise<{ token?: string; error?: string }> {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) return { error: "Refresh token não encontrado." };

    try {
      const refreshToken = localStorage.getItem("refresh_token");
      const res = await api.get("/auth/refresh-token", {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });
      const { access_token } = res.data;
      localStorage.setItem("access_token", access_token);
      return { token: access_token };
    } catch {
      return { error: "Falha ao atualizar o token." };
    }
  }

  async logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }
}

export const authClient = new AuthClient();
