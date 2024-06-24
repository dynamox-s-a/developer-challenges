'use server'
import * as z from 'zod';
import { AuthError } from 'next-auth';

import { signIn, signOut } from '../../auth';
import { LoginSchema } from '@/schemas';

import { DEFAULT_LOGIN_REDIRECT } from '../../routes';



export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Campos inválidos!" };
    }

    const { email, password } = validatedFields.data;

  

    try {
        const user = await signIn('credentials', {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT,
        });
        return { 
            success: "Bem vindo!",
            user
         }
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Credenciais inválidas!" };
                default: { error: "Alguma coisa deu errado!" }
            }
        }
        
        throw error;
    }
};