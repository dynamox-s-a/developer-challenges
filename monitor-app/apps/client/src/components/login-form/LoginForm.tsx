'use client'

import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { enqueueSnackbar, SnackbarProvider } from 'notistack'

export default function LoginForm() {
  const [buttonDisabled, setButtonDisabled] = useState(true)
  const [showPassword, setShowPassword] = useState(false)

  const router = useRouter()

  const handleClickShowPassword = () => setShowPassword((showPassword) => !showPassword)

  const handleMouseEvents = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  type FormValues = {
    email: string
    password: string
  }

  const {
    handleSubmit,
    formState: { errors },
    register
  } = useForm<FormValues>()

  const onSubmit: SubmitHandler<FormValues> = async ({ email, password }) => {
    const response = await signIn('credentials', {
      email: email,
      userPassword: password,
      redirect: false,
      callbackUrl: '/dashboard'
    })
    if (response?.error) {
      enqueueSnackbar(response?.error, {
        variant: 'error',
        anchorOrigin: { horizontal: 'center', vertical: 'bottom' }
      })
      return
    }
    router.push('/dashboard')
  }

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <Container maxWidth={'sm'}>
        <Stack spacing={2} component={'form'} onSubmit={handleSubmit(onSubmit)}>
          <Typography variant="h4" component="h1">
            Login
          </Typography>
          <SnackbarProvider />
          <TextField
            fullWidth
            label="E-mail"
            {...register('email', {
              required: 'E-mail is required',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Entered value does not match email format'
              }
            })}
            onChange={(text) => setButtonDisabled(!text.target.value)}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseEvents}
                    onMouseUp={handleMouseEvents}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={!!errors.password}
            helperText={errors.password?.message}
            {...register('password', {
              required: 'Password is required'
            })}
          />
          <Button type="submit" disabled={buttonDisabled} fullWidth variant="contained">
            Enter
          </Button>
        </Stack>
      </Container>
    </Box>
  )
}
