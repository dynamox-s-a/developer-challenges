import {
    Button,
    Container,
    TextField,
    Typography,
    Alert,
    Box,
} from '@mui/material';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { authThunk } from '../features/auth/authThunks';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const dispatch = useAppDispatch();
    const nav = useNavigate();
    const { status, error } = useAppSelector((s) => s.auth);

    const [email, setEmail] = useState('admin@dynamox.com');
    const [password, setPassword] = useState('123456');

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>

            <Typography variant="h4" sx={{ mb: 3 }}>
                Login
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Box sx={{ display: 'grid', gap: 2 }}>

                <TextField
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Button
                    variant="contained"
                    disabled={status === 'loading'}
                    onClick={async () => {
                        const r = await dispatch(authThunk({ email, password }));
                        if (authThunk.fulfilled.match(r)) nav('/machines', { replace: true });

                        // await fetch('/api/health', {
                        //     method: 'GET',
                        //     headers: { 'Content-Type': 'application/json' },
                        // });
                    }}
                >
                    {status === 'loading' ? 'Entrando...' : 'Entrar'}
                </Button>
            </Box>
        </Container>
    );
}
