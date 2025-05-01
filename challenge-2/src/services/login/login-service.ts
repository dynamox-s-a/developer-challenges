import type { LoginService, LoginState, User } from "./types";

const API_URL = "http://localhost:3001";

export class LoginServiceImpl implements LoginService {
	async authenticate(email: string, password: string): Promise<LoginState> {
		try {
			const res = await fetch(
				`${API_URL}/users?email=${encodeURIComponent(email)}`,
			);
			if (!res.ok) {
				return {
					user: null,
					loading: false,
					error: "Erro ao buscar usuário"
				};
			}

			const users: User[] = await res.json();
			if (!users?.length) {
				return {
					user: null,
					loading: false,
					error: "Usuário não encontrado"
				};
			}

			const user = users[0];
			if (user.senha !== password) {
				return {
					user: null,
					loading: false,
					error: "Senha incorreta"
				};
			}

			return {
				user,
				loading: false,
				error: null
			};
		} catch (error) {
			console.error("Erro na autenticação:", error);
			return {
				user: null,
				loading: false,
				error: "Erro na autenticação"
			};
		}
	}
}
