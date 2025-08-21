import { Button, TextField, Box, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { login } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import type { FormEvent } from 'react';

export default function LoginPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
  
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const handleLogin = (e: FormEvent) => {
        e.preventDefault();
    
        // temporary check mode
        if (email === 'admin@dynamox.com' && password === '123456') {
            dispatch(login());
            navigate('/dashboard');
        } else {
            alert('Invalid credentials');
        }
    };
  
    return (
        <Box display="flex" flexDirection="column" alignItems="center" mt={10}>
            <Typography variant="h4">Login</Typography>
            <Box component="form" onSubmit={handleLogin} width="300px" mt={2}>
                <TextField
                    fullWidth
                    label="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    margin="normal"
                />
                <Button variant="contained" type="submit" fullWidth>
                    Enter
                </Button>
            </Box>
        </Box>
    );
}
