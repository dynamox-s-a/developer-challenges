"use client"

import { Box, Button, TextField, Typography } from "@mui/material"
import { useForm } from "react-hook-form"
import { loginRequestSchema, type loginRequest } from '@/lib/http/auth/types';
import { zodResolver } from "@hookform/resolvers/zod";
import { authService } from "@/lib/http/auth";
import { useState } from "react";
import { ErrorDialog } from "@/components/ui/dialogs/ErrorDialog";
import { useRouter } from "next/navigation";

export const customBox = {
    display: "flex", 
    flexDirection: "column", 
    justifyContent: "center", 
    alignItems: "center", 
    border: "2px solid grey"
}

export default function LoginForm() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalError, setModalError] = useState('');
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: {errors}
  } = useForm<loginRequest>({
    resolver: zodResolver(loginRequestSchema)
  })

  const onSubmit = async (data: loginRequest) => {
    const result = await authService.login(data)
    if (!result.success) {
      setModalError(result.message)
      setModalOpen(true)
    }
    if (result.success) {
      router.push('/dashboard')
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
        alignItems={"center"}
        sx={customBox}
        onSubmit={handleSubmit(onSubmit)}
        >
        <Typography variant="h5" component="div" sx={{mb: 2}}>
          Sign In
        </Typography>

        <TextField 
          label="Email"
          variant="outlined"
          sx={{
            mb: 2
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
            mb: 2
          }}
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <Button
          variant="contained"
          type="submit"
        >
          Submit
        </Button>

      </Box>
      <ErrorDialog 
        open={modalOpen}
        message={modalError}
        onClose={() => setModalOpen(false)}
      />
    </>
  )
}