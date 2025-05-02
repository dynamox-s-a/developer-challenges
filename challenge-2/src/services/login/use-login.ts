import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/auth/slice";
import { LoginServiceImpl } from "./login-service";
import type { LoginService, LoginState } from "./types";

const loginService: LoginService = new LoginServiceImpl();

export function useLogin() {
	const dispatch = useDispatch();
	const [state, setState] = useState<LoginState>({
		user: null,
		loading: false,
		error: null,
	});

	const login = async (email: string, password: string) => {
		setState((prev) => ({ ...prev, loading: true }));
		const result = await loginService.authenticate(email, password);
		setState(result);

		if (result.user) {
			dispatch(setUser(result.user));
		}

		return result;
	};

	return {
		...state,
		login,
	};
}
