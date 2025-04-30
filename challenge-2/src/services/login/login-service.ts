import type { User } from "./types";

const API_URL = "http://localhost:3001";

export async function authenticate(
	email: string,
	senha: string,
): Promise<User | null> {
	try {
		const res = await fetch(
			`${API_URL}/users?email=${encodeURIComponent(email)}`,
		);
		if (!res.ok) throw new Error("Erro ao buscar usuário");

		const users: User[] = await res.json();
		if (!users?.length) return null;

		const user = users[0];
		if (user.senha !== senha) return null;

		return user;
	} catch (error) {
		console.error("Erro na autenticação:", error);
		return null;
	}
}
