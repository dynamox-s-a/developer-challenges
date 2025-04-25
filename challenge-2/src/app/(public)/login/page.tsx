// components/Login.tsx
'use client'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { login } from '@/store/thunk/auth-thunk'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, Container, FormControl, Input, InputLabel, Typography } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'Senha precisa ter pelo menos 6 caracteres' }),
})

type LoginSchemaType = z.infer<typeof loginSchema>

export default function Login() {
  const { isLoading, error } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: LoginSchemaType) {
    await dispatch(login({ username: data.email, password: data.password }))
  }

  return (
    <>
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          mt: { xs: '64px', lg: '32px' },
          gap: '48px',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <Typography component={'h1'} variant="h4">
            Faça seu login
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              maxWidth: '400px',
              gap: '32px',
            }}
          >
            <FormControl error={!!errors.email}>
              <InputLabel htmlFor="email">Email</InputLabel>
              <Controller
                name="email"
                control={control}
                render={({ field }) => <Input {...field} id="email" type="email" />}
              />
              {errors.email && (
                <Typography color="error" variant="body2">
                  {errors.email.message}
                </Typography>
              )}
            </FormControl>

            <FormControl error={!!errors.password}>
              <InputLabel htmlFor="password">Senha</InputLabel>
              <Controller
                name="password"
                control={control}
                render={({ field }) => <Input {...field} id="password" type="password" />}
              />
              {errors.password && (
                <Typography color="error" variant="body2">
                  {errors.password.message}
                </Typography>
              )}
            </FormControl>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: 'center',
                gap: '8px',
              }}
            >
              <Button type="submit" variant="contained" disabled={isLoading}>
                {isLoading ? 'Carregando...' : 'Entrar'}
              </Button>

              {error && (
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
              )}
            </Box>
          </form>
        </Box>
      </Container>
    </>
  )
}
