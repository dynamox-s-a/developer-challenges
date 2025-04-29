'use client'

import { useAppDispatch, useAppSelector } from '@/store/store'
import { login } from '@/store/thunk/auth-thunk'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, Container, TextField, Typography } from '@mui/material'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
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
    register,
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
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        mt: { xs: '64px', lg: '32px' },
        gap: '48px',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <Box sx={{ mb: '80px' }}>
          <Image src={'/dynamox-logo-wine.svg'} alt="" width={150} height={100} />
        </Box>

        <Typography component="h1" variant="h4">
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
          <TextField
            label="Email"
            type="email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            fullWidth
          />

          <TextField
            label="Senha"
            type="password"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            fullWidth
          />

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
      <Typography sx={{ fontSize: '13px', mt: '80px', textAlign: 'center', color: '#636363' }}>
        Feito por @albanogabriel / Teste técnico @dynamox
      </Typography>
    </Container>
  )
}
