import { LoginServiceImpl } from "../login-service";
import type { User } from "../types";

describe("LoginService", () => {
	let loginService: LoginServiceImpl;
	let fetchMock: jest.Mock;

	beforeEach(() => {
		fetchMock = jest.fn();
		global.fetch = fetchMock;
		loginService = new LoginServiceImpl();
	});

	it("should authenticate successfully with valid credentials", async () => {
		const mockUser: User = {
			id: 1,
			email: "admin@example.com",
			senha: "admin123",
			role: "admin",
		};

		fetchMock.mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve([mockUser]),
		});

		const result = await loginService.authenticate(
			"admin@example.com",
			"admin123",
		);

		expect(result).toEqual({
			user: mockUser,
			loading: false,
			error: null,
		});
		expect(fetchMock).toHaveBeenCalledWith(
			`${process.env.NODE_BASE_URL || "http://localhost:3001"}/users?email=admin%40example.com`,
		);
	});

	it("should return error when user is not found", async () => {
		fetchMock.mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve([]),
		});

		const result = await loginService.authenticate(
			"nonexistent@example.com",
			"password",
		);

		expect(result).toEqual({
			user: null,
			loading: false,
			error: "Usuário não encontrado",
		});
	});

	it("should return error when password is incorrect", async () => {
		const mockUser: User = {
			id: 1,
			email: "admin@example.com",
			senha: "correctpassword",
			role: "admin",
		};

		fetchMock.mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve([mockUser]),
		});

		const result = await loginService.authenticate(
			"admin@example.com",
			"wrongpassword",
		);

		expect(result).toEqual({
			user: null,
			loading: false,
			error: "Senha ou email incorretos",
		});
	});

	it("should handle API errors", async () => {
		fetchMock.mockResolvedValueOnce({
			ok: false,
		});

		const result = await loginService.authenticate(
			"admin@example.com",
			"admin123",
		);

		expect(result).toEqual({
			user: null,
			loading: false,
			error: "Erro ao buscar usuário",
		});
	});

	it("should handle network errors", async () => {
		fetchMock.mockRejectedValueOnce(new Error("Network error"));

		const result = await loginService.authenticate(
			"admin@example.com",
			"admin123",
		);

		expect(result).toEqual({
			user: null,
			loading: false,
			error: "Erro na autenticação",
		});
	});
});
