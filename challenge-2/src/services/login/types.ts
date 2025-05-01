export interface User {
	id: number;
	email: string;
	senha: string;
	role: string;
}

export interface LoginState {
	user: User | null;
	loading: boolean;
	error: string | null;
}

export interface LoginService {
	authenticate(email: string, password: string): Promise<LoginState>;
}

export interface TokenPayload {
	id: number;
	email: string;
	role: string;
}
