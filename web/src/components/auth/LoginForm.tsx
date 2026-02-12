'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Paper, Button, TextField, Typography } from '@mui/material'

import { authService } from '@/lib/http/auth'
import { loginRequestSchema, type loginRequest } from '@/lib/http/auth/types'
import { BlurFade } from '@/components/ui/blur-fade'
import { AuroraText } from '@/components/ui/aurora-text'
import { ErrorDialog } from '@/components/ui/error-dialog'

export default function LoginForm() {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalError, setModalError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginRequest>({
    resolver: zodResolver(loginRequestSchema),
  })

  const onSubmit = async (data: loginRequest) => {
    const result = await authService.login(data)
    if (!result.success) {
      setModalError(result.message)
      setModalOpen(true)
      return
    }
    router.push('/dashboard')
  }

  return (
    <>
      <BlurFade
        delay={0.25}
        inView
      >
        <Paper
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          elevation={6}
          sx={{
            width: { xs: '90%', sm: 440 },
            maxWidth: '100%',
            mx: 'auto',
            my: 4,
            p: { xs: 3, sm: 5 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.3)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{ mb: 3, fontWeight: 700 }}
          >
            Sign <AuroraText>In</AuroraText>
          </Typography>

          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            sx={{ mb: 2.5 }}
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            sx={{ mb: 3 }}
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <Button
            type="submit"
            variant="contained"
            color="secondary"
            size="large"
            fullWidth
            sx={{
              py: 1.8,
              fontSize: '1.1rem',
              boxShadow: 3,
              borderRadius: 2,
              textTransform: 'none',
            }}
          >
            Sign In
          </Button>
        </Paper>
      </BlurFade>

      <ErrorDialog
        open={modalOpen}
        message={modalError}
        onClose={() => setModalOpen(false)}
      />
    </>
  )
}
