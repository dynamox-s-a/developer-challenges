"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { tokenStorage } from "@/services/login/token-service";
import { type LoginSchema, loginSchema } from "./types";
import LoginForm from "./view";
import { useLogin } from "@/services/login";

function useLoginController() {
	const router = useRouter();
	const form = useForm<LoginSchema>({
		resolver: zodResolver(loginSchema),
		mode: "onChange",
		defaultValues: {
			email: "",
			senha: "",
		},
	});

	const { login, error: loginError, loading } = useLogin();

	async function handleSubmit(data: LoginSchema) {
		try {
			form.clearErrors();

			const result = await login(data.email, data.senha);
			if (result.user) {
				tokenStorage.save({
					id: result.user.id,
					email: result.user.email,
					role: result.user.role,
				});

				if (result.user.role === "admin") {
					router.push("/events/manage");
				} else {
					router.push("/events");
				}
			}
		} catch (error) {
			console.error(error);
		}
	}

	return {
		form,
		loginError,
		loading,
		onSubmit: handleSubmit,
	};
}

export default function LoginController() {
	const { form, loginError, onSubmit, loading } = useLoginController();

	return (
		<LoginForm
			handleSubmit={form.handleSubmit}
			register={form.register}
			errors={form.formState.errors}
			isSubmitting={form.formState.isSubmitting}
			onSubmit={onSubmit}
			loginError={loginError}
			loading={loading}
		/>
	);
}
