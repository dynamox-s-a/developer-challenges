import { useEffect, useState } from 'react'
import { Alert, Box, Button, Card, CardContent, TextField, Typography, Divider } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { loginThunk } from '../features/auth/authThunks'
import { useAppDispatch, useAppSelector } from '../app/hooks'

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { token, status, error } = useAppSelector((s) => s.auth)

  const [email, setEmail] = useState('admin@dynamox.com')
  const [password, setPassword] = useState('123456')

  useEffect(() => {
    if (token) navigate('/machines', { replace: true })
  }, [token, navigate])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await dispatch(loginThunk({ email, password }))
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        p: 2,
        bgcolor: 'background.default',
        backgroundImage: `
          radial-gradient(circle at 10% 10%, rgba(99,102,241,0.18), transparent 42%),
          radial-gradient(circle at 90% 18%, rgba(16,185,129,0.12), transparent 46%),
          linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0))
        `
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 460,
          borderRadius: 3,
          border: (t) => `1px solid ${t.palette.divider}`,
          bgcolor: 'background.paper',
          backdropFilter: 'blur(10px)'
        }}
      >
        <CardContent component="form" onSubmit={onSubmit} sx={{ p: 3 }}>
          <Typography variant="overline" sx={{ opacity: 0.8, letterSpacing: 1 }}>
            VektorPredict
          </Typography>

          <Typography variant="h5" sx={{ fontWeight: 900, mb: 0.5 }}>
            Acessar painel
          </Typography>

          <Typography variant="body2" sx={{ opacity: 0.75, mb: 2 }}>
            Entre com suas credenciais para gerenciar máquinas, pontos de monitoramento e sensores.
          </Typography>

          <Divider sx={{ mb: 2 }} />

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="E-mail"
            margin="normal"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            fullWidth
            label="Senha"
            type="password"
            margin="normal"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            fullWidth
            type="submit"
            color="primary"
            disabled={status === 'loading'}
            sx={{ mt: 2, py: 1.2, fontWeight: 800 }}
          >
            {status === 'loading' ? 'Entr,tp' : 'Entrar'}
          </Button>


          <Typography variant="caption" sx={{ display: 'block', mt: 2, opacity: 0.7 }}>
            Ao acessar, você concorda com as políticas internas de uso e segurança.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}
