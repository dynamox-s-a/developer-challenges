import type {
	FieldErrors,
	UseFormHandleSubmit,
	UseFormRegister,
} from "react-hook-form";
import { z } from "zod";

export const loginSchema = z.object({
	email: z.string().email({ message: "E-mail inválido" }),
	senha: z
		.string()
		.min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
});

export interface LoginSchema {
	email: string;
	senha: string;
}

export interface User {
	id: number;
	email: string;
	senha: string;
	role: string;
	token: string;
}

export interface TokenPayload {
	id: number;
	email: string;
	role: string;
}

export interface LoginFormProps {
	handleSubmit: UseFormHandleSubmit<LoginSchema>;
	register: UseFormRegister<LoginSchema>;
	errors: FieldErrors<LoginSchema>;
	isSubmitting: boolean;
	onSubmit: (data: LoginSchema) => Promise<void>;
	loginError: string | null;
	loading: boolean;
}
