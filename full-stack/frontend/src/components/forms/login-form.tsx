"use client";

import {zodResolver} from '@hookform/resolvers/zod';
import {TextField, Button} from '@mui/material';
import {useForm} from 'react-hook-form';
import {useRouter} from 'next/navigation';
import {z} from 'zod';
import {setToken} from "@/src/store/authSlice";
import {useDispatch} from "react-redux";
import {api} from "@/src/utils/apiClient";
import {saveToken} from "@/src/utils/auth";

export const schemaLogin = z.object({
    email: z.string().email("Informe um e-mail válido"),
    password: z.string().min(7, {message: "Senha precisa ter mais de 7 caracteres"})
});

export const LoginForm = () => {
    const router = useRouter();
    const dispatch = useDispatch();

    const form = useForm<z.infer<typeof schemaLogin>>({
        resolver: zodResolver(schemaLogin),
        defaultValues: {
            email: '',
            password: ''
        },
        mode: 'all',
        reValidateMode: 'onSubmit',
        criteriaMode: 'all',
    });

    const onSubmit = async (values: z.infer<typeof schemaLogin>) => {
        try {
            const response = await api.post('/auth', values);
            const token = response.data.access_token;

            console.log('Token recebido:', token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            saveToken(token);
            dispatch(setToken(token));
            router.push('/machines');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                {...form.register('email', {required: 'Email is required'})}
                error={!!form.formState.errors.email}
                helperText={form.formState.errors.email ? form.formState.errors.email.message : ''}
            />
            <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                {...form.register('password', {required: 'Password is required'})}
                error={!!form.formState.errors.password}
                helperText={form.formState.errors.password ? form.formState.errors.password.message : ''}
            />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                style={{marginTop: '16px'}}
            >
                Acessar
            </Button>
        </form>
    )
}
