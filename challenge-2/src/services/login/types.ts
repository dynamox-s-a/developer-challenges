export interface TokenPayload {
	id: number;
	email: string;
	role: string;
}

export interface User {
	id: number;
	email: string;
	senha: string;
	role: string;
}
