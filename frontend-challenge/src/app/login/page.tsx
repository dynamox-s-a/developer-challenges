'use client'

import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import api from '@/services/api'
import { generateFakeToken } from '@/utils/auth'
import { loginSuccess } from '@/store/authSlice'
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    CircularProgress,
    Alert
} from '@mui/material'
import { useState } from 'react'
import type { AppDispatch } from '@/store'
import type { User } from '@/types/User'

export default function LoginPage() {
    const dispatch = useDispatch<AppDispatch>()
    const router = useRouter()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleLogin = async () => {
        setLoading(true)
        setError('')

        try {
            const res = await api.get('/users', {
                params: { email, password }
            })

            const apiUser = res.data[0]

            if (!apiUser) {
                throw new Error('Credenciais inválidas')
            }

            // Normalização do user
            const user: User = {
                id: apiUser.id,
                email: apiUser.email,
                role: apiUser.role
            }

            const token = generateFakeToken(user)

            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(user))

            dispatch(loginSuccess({ user, token }))

            if (user.role === 'admin') {
                router.push('/admin/dashboard')
            } else {
                router.push('/events')
            }
        } catch (error) {
            console.error(error)
            setError('E-mail ou senha incorretos')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box
            minHeight="100vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bgcolor="#f4f6f8"
            px={2}
        >
            <Paper
                elevation={0}
                sx={{
                    width: '100%',
                    maxWidth: 420,
                    p: 4,
                    borderRadius: 3
                }}
            >
                <Typography variant="h5" fontWeight={600} gutterBottom>
                    Bem-vindo de volta
                </Typography>

                <Typography variant="body2" color="text.secondary" mb={3}>
                    Faça login para acessar sua conta
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    margin="normal"
                    autoComplete="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />

                <TextField
                    label="Senha"
                    type="password"
                    fullWidth
                    margin="normal"
                    autoComplete="current-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />

                <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{ mt: 3, height: 48 }}
                    onClick={handleLogin}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'Entrar'}
                </Button>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                    mt={3}
                >
                    © {new Date().getFullYear()} Plataforma de eventos
                </Typography>
            </Paper>
        </Box>
    )
}
