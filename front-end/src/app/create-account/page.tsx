'use client'

import React, { useState, /*useEffect*/ } from 'react'
import { useRouter } from 'next/navigation';
import {
    Button,
    TextField,
    Typography
} from '@mui/material';
import { useAppSelector, useAppDispatch } from '../../lib/hooks'

import { Container } from './styles'

export default function Page() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSubmit = async () => {
        const request = new Request('http://localhost:3333/users', {
            method: 'POST',
            body: JSON.stringify({
                email: login,
                password
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        await fetch(request)
        //todo error notification
        router.push('/login');
    }

    return (
        <>
            <Container>
                <Typography variant='h4' align='center'>Create account</Typography>
                <TextField 
                    required
                    label="Login"
                    value={login}
                    onChange={(e:React.ChangeEvent<HTMLInputElement>) => setLogin(e.target.value)}
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
                <Button variant="outlined" sx={{m:2}} disabled={login === '' || password === ''} onClick={handleSubmit}>
                    Create
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => router.push('/login')}
                    sx={{m:2}}
                >
                    Cancel
                </Button>
            </Container>
        </>
    )
}