'use client'

import { authService } from '@/lib/http/auth'
import { registerRequestSchema, type registerRequest } from '@/lib/http/auth/services/auth.types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, TextField, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { ErrorModal } from '../errorModal'
import { useState } from 'react'
import { useRouter } from "next/navigation";

export const customBox = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  border: '2px solid grey',
}

export default function RegisterComponent() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<registerRequest>({
    resolver: zodResolver(registerRequestSchema),
  })

  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false);
  const [modalError, setModalError] = useState('');

  const onSubmit = async (data: registerRequest) => {
    const response = await authService.register(data)
    if (!response.success) {
      setModalError(response.message);
      setModalOpen(true);
    }

    if (response.success) {
      router.push('/auth/login')
    }
  }

  return (
    <>
    <Box
      component="form"
      height={500}
      width={400}
      display={'flex'}
      my={4}
      alignItems={'center'}
      sx={customBox}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Typography
        variant="h5"
        component="div"
        sx={{ mb: 2 }}
      >
        Sign Up
      </Typography>
      <TextField
        label="Name"
        variant="outlined"
        sx={{
          mb: 2,
        }}
        {...register("name")}
        error={!!errors.name}
        helperText={errors.name?.message}
      />
      <TextField
        label="Email"
        variant="outlined"
        sx={{
          mb: 2,
        }}
        {...register("email")}
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      <TextField
        label="Password"
        variant="outlined"
        type="password"
        sx={{
          mb: 2,
        }}
        {...register("password")}
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      <Button variant="contained" type="submit">
        Submit
      </Button>
    </Box>
    <ErrorModal 
      open={modalOpen}
      message={modalError}
      onClose={() => setModalOpen(false)}
    />
  </>
  )
}
