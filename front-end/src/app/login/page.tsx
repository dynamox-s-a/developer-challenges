'use client'

import React, { useState, /*useEffect*/ } from 'react'
import { useRouter } from 'next/navigation';
import {
    Button,
    TextField,
    Typography
} from '@mui/material';
import { useAppDispatch } from '@/lib/hooks';
import { login } from '@/lib/features/usersSlice';

import { Container } from './styles';

export default function Page() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const dispatch = useAppDispatch();

    const handleSubmit = async () => {
        const request = new Request(`http://localhost:3333/login/email=${email}&password=${password}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const data = await fetch(request)
        const response = await data.json();

        if(response !== null){
            dispatch(login({
                id: response.id,
                email: response.email,
                password: response.password,
            }));
            router.push('/main');
        }
        //todo error notification
    }

    return (
        <>
            <Container>
                <Typography variant='h4' align='center'>Login</Typography>
                <TextField 
                    required
                    label="Login"
                    value={email}
                    onChange={(e:React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    sx={{m:3}}
                />
                <TextField 
                    required
                    label="Password"
                    value={password}
                    type="password"
                    onChange={(e:React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    sx={{m:3}}
                />
                <Button variant="outlined" sx={{m:2}} disabled={email === '' || password === ''} onClick={handleSubmit}>
                    Log In
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => router.push('/create-account')}
                    sx={{m:2}}
                >
                    Create New Account
                </Button>
            </Container>
        </>
    )
}