import jwt from "jsonwebtoken";
import type { TokenPayload } from "./types";

const JWT_SECRET_ADMIN = "secret-admin-key-2025";
const JWT_SECRET_READER = "secret-reader-key-2025";

export function verifyToken(token: string): TokenPayload | null {
	try {
		try {
			return jwt.verify(token, JWT_SECRET_ADMIN) as TokenPayload;
		} catch {
			return jwt.verify(token, JWT_SECRET_READER) as TokenPayload;
		}
	} catch (error) {
		console.error("Erro ao verificar token:", error);
		return null;
	}
}

export const tokenStorage = {
	save: (token: string) => localStorage.setItem("auth_token", token),
	get: () => localStorage.getItem("auth_token"),
	remove: () => localStorage.removeItem("auth_token"),
};
