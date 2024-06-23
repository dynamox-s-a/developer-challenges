import * as z from "zod";

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Endereço de email inválido",
    }),
    password: z.string({
        invalid_type_error: "Senha inválida",
    }).min(1, {
        message: "Senha inválida",
    })
});

export const RegisterSchema = z.object({
    email: z.string().email({
        message: "Endereço de email inválido",
    }),
    password: z.string({
        invalid_type_error: "Senha inválida",
    }).min(6, {
        message: "Mínimo de 6 caracteres",
    }),
    name: z.string().min(1, { 
        message: "Nome é obrigatório" 
    }),
    cpf: z.string().min(1, {
        message: "CPF é obrigatório"
    }),
});

export const ResetSchema = z.object({
    email: z.string().email({
        message: "Endereço de email inválido",
    })
});

export const NewPasswordSchema = z.object({
    password: z.string().min(6, {
        message: "Mínimo de 6 caracteres"
    })
});


