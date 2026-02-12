import { useState } from 'react'
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
import { registerThunk } from '../features/auth/authThunks'
import {
  selectAuthError,
  selectAuthStatus
} from '../features/auth/authSelectors'
import { clearAuthError } from '../features/auth/authSlice'

export function RegisterPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const status = useAppSelector(selectAuthStatus)
  const error = useAppSelector(selectAuthError)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [success, setSuccess] = useState(false)

  const isLoading = status === 'loading'
  const isFormValid = name.trim() && email.trim() && password.length >= 8

  async function onSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    dispatch(clearAuthError())
    setSuccess(false)

    const result = await dispatch(registerThunk({ name, email, password }))

    if (registerThunk.fulfilled.match(result)) {
      setSuccess(true)
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    }
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
              Criar Conta
            </Typography>

            <Box
              component='form'
              onSubmit={onSubmit}
              display='grid'
              gap={2}
              mt={2}
            >
              {error && <Alert severity='error'>{error}</Alert>}
              {success && (
                <Alert severity='success'>
                  Conta criada com sucesso! Redirecionando para login...
                </Alert>
              )}

              <TextField
                label='Nome'
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                required
              />

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
                placeholder='Senha deve ter no mínimo 8 caracteres'
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
                    Criando conta...
                  </>
                ) : (
                  'Criar Conta'
                )}
              </Button>

              <Button
                variant='text'
                onClick={() => navigate('/login')}
                fullWidth
              >
                Já tem conta? Faça login
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}
