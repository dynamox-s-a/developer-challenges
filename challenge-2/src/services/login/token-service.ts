import type { TokenPayload } from "./types";

function generateFakeToken(payload: TokenPayload): string {
	const header = btoa(JSON.stringify({ alg: "fake", typ: "JWT" }));
	const payloadBase64 = btoa(JSON.stringify(payload));
	const signature = btoa(`fake-signature-${new Date().getTime()}`);

	return `${header}.${payloadBase64}.${signature}`;
}

function saveUser(user: TokenPayload): void {
	const token = generateFakeToken(user);
	localStorage.setItem("token", token);
	localStorage.setItem("user", JSON.stringify(user));
}

function getUser(): TokenPayload | null {
	const user = localStorage.getItem("user");
	if (!user) return null;

	try {
		return JSON.parse(user) as TokenPayload;
	} catch {
		return null;
	}
}

function getToken(): string | null {
	return localStorage.getItem("token");
}

function removeUser(): void {
	localStorage.removeItem("token");
	localStorage.removeItem("user");
}

export const tokenStorage = {
	save: saveUser,
	verifyToken: getUser,
	getToken,
	remove: removeUser,
};
