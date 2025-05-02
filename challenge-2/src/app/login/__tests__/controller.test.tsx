import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/services/login";
import { tokenStorage } from "@/services/login/token-service";
import LoginController from "../controller";

jest.mock("next/navigation", () => ({
	useRouter: jest.fn(),
}));

jest.mock("@/services/login", () => ({
	useLogin: jest.fn(),
}));

jest.mock("@/services/login/token-service", () => ({
	tokenStorage: {
		save: jest.fn(),
	},
}));

describe("LoginController", () => {
	const mockRouter = {
		push: jest.fn(),
	};

	const mockLoginFn = jest.fn();

	beforeEach(() => {
		(useRouter as jest.Mock).mockReturnValue(mockRouter);
		(useLogin as jest.Mock).mockReturnValue({
			login: mockLoginFn,
			error: null,
			loading: false,
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should redirect to /events/manage when admin logs in successfully", async () => {
		const mockAdminUser = {
			id: 1,
			email: "admin@example.com",
			senha: "admin123",
			role: "admin",
		};

		mockLoginFn.mockResolvedValueOnce({
			user: mockAdminUser,
			loading: false,
			error: null,
		});

		render(<LoginController />);

		const emailInput = screen.getByLabelText(/e-mail/i);
		const passwordInput = screen.getByLabelText(/senha/i);
		const submitButton = screen.getByRole("button", { name: /entrar/i });

		fireEvent.change(emailInput, { target: { value: "admin@example.com" } });
		fireEvent.change(passwordInput, { target: { value: "admin123" } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(tokenStorage.save).toHaveBeenCalledWith({
				id: mockAdminUser.id,
				email: mockAdminUser.email,
				role: mockAdminUser.role,
			});
			expect(mockRouter.push).toHaveBeenCalledWith("/events/manage");
		});
	});

	it("should redirect to /events when non-admin user logs in successfully", async () => {
		const mockUser = {
			id: 2,
			email: "user@example.com",
			senha: "user123",
			role: "user",
		};

		mockLoginFn.mockResolvedValueOnce({
			user: mockUser,
			loading: false,
			error: null,
		});

		render(<LoginController />);

		const emailInput = screen.getByLabelText(/e-mail/i);
		const passwordInput = screen.getByLabelText(/senha/i);
		const submitButton = screen.getByRole("button", { name: /entrar/i });

		fireEvent.change(emailInput, { target: { value: "user@example.com" } });
		fireEvent.change(passwordInput, { target: { value: "user123" } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(tokenStorage.save).toHaveBeenCalledWith({
				id: mockUser.id,
				email: mockUser.email,
				role: mockUser.role,
			});
			expect(mockRouter.push).toHaveBeenCalledWith("/events");
		});
	});

	it("should handle login errors", async () => {
		mockLoginFn.mockResolvedValueOnce({
			user: null,
			loading: false,
			error: "Credenciais inválidas",
		});

		render(<LoginController />);

		const emailInput = screen.getByLabelText(/e-mail/i);
		const passwordInput = screen.getByLabelText(/senha/i);
		const submitButton = screen.getByRole("button", { name: /entrar/i });

		fireEvent.change(emailInput, { target: { value: "wrong@example.com" } });
		fireEvent.change(passwordInput, { target: { value: "wrongpass" } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(tokenStorage.save).not.toHaveBeenCalled();
			expect(mockRouter.push).not.toHaveBeenCalled();
		});
	});
});
