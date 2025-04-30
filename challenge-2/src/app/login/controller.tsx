"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { authenticate } from "@/services/login/login-service";
import { tokenStorage } from "@/services/login/token-service";
import { type LoginSchema, loginSchema } from "./types";
import LoginForm from "./view";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/auth/slice";

function useLoginController() {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const form = useForm<LoginSchema>({
		resolver: zodResolver(loginSchema),
		mode: "onChange",
		defaultValues: {
			email: "",
			senha: "",
		},
	});
	const [loginError, setLoginError] = useState<string | null>(null);

	async function onSubmit(data: LoginSchema) {
		try {
			setLoginError(null);
			form.clearErrors();

			const user = await authenticate(data.email, data.senha);

			if (!user) {
				const errorMessage = "Usuário ou senha inválidos";
				setLoginError(errorMessage);
				form.setError("email", { type: "manual", message: errorMessage });
				form.setError("senha", { type: "manual", message: errorMessage });
				return;
			}

			const userData = { id: user.id, email: user.email, role: user.role };
			tokenStorage.save(userData);
			dispatch(setUser(userData));

			router.push("/events");
		} catch (error) {
			console.error("Erro ao fazer login:", error);
			setLoginError("Erro ao fazer login. Tente novamente.");
		}
	}

	return {
		form,
		loginError,
		onSubmit,
	};
}

export default function LoginController() {
	const { form, loginError, onSubmit } = useLoginController();

	return (
		<LoginForm
			handleSubmit={form.handleSubmit}
			register={form.register}
			errors={form.formState.errors}
			isSubmitting={form.formState.isSubmitting}
			onSubmit={onSubmit}
			loginError={loginError}
		/>
	);
}
