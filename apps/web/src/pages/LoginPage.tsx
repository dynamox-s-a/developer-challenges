import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  TextField,
  Typography
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { loginThunk } from '../features/auth/authThunks'
import {
  selectAuthError,
  selectAuthStatus,
  selectIsAuthenticated
} from '../features/auth/authSelectors'
import { clearAuthError } from '../features/auth/authSlice'

export function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const status = useAppSelector(selectAuthStatus)
  const error = useAppSelector(selectAuthError)
  const isAuth = useAppSelector(selectIsAuthenticated)

  const [email, setEmail] = useState('admin@dynamox.com')
  const [password, setPassword] = useState('')

  const isLoading = status === 'loading'
  const isFormValid = email.trim() && password.length >= 8

  useEffect(() => {
    if (isAuth) navigate('/app/monitoring-points', { replace: true })
  }, [isAuth, navigate])

  async function onSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    dispatch(clearAuthError())
    await dispatch(loginThunk({ email, password }))
  }

  return (
    <Container maxWidth='sm'>
      <Box
        minHeight='100vh'
        display='flex'
        alignItems='center'
        justifyContent='center'
      >
        <Card sx={{ width: '100%' }}>
          <CardContent>
            <Typography variant='h5' fontWeight={700} gutterBottom>
              Login
            </Typography>

            <Box
              component='form'
              onSubmit={onSubmit}
              display='grid'
              gap={2}
              mt={2}
            >
              {error && <Alert severity='error'>{error}</Alert>}

              <TextField
                label='Email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
              />

              <TextField
                label='Senha'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
              />

              <Button
                type='submit'
                variant='contained'
                disabled={isLoading || !isFormValid}
                fullWidth
                sx={{ py: 1.2 }}
              >
                {isLoading ? (
                  <>
                    <CircularProgress size={18} sx={{ mr: 1 }} />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
              <Button
                variant='text'
                onClick={() => navigate('/register')}
                fullWidth
              >
                Não tem conta? Crie aqui
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}
