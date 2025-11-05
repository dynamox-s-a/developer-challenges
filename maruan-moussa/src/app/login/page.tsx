"use client"

import type React from "react"

import { Box, Card, TextField, Button, Typography, Container, InputAdornment } from "@mui/material"
import { useRouter } from "next/navigation"
import { Email, Lock, CalendarMonth } from "@mui/icons-material"
import { useState } from "react"
import { motion } from "framer-motion"
import { useAppDispatch, useAppSelector } from "@/store"
import { login } from "@/store/authSlice"

const MotionBox = motion(Box)

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const {  loading, error } = useAppSelector((state) => state.auth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return;

    const resultAction = await dispatch(login({ email, password }));

    if (login.fulfilled.match(resultAction)) {
      const userRole = resultAction.payload.user.role;

      if (userRole === "admin") {
        router.push("/admin")
      } else {
        router.push("/reader")
      }
    }

  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <Container maxWidth="sm">
        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #7C3AED 0%, #0891B2 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CalendarMonth sx={{ fontSize: 32, color: "white" }} />
              </Box>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              Event Manager
            </Typography>
          </Box>
          <Card
            component="form"
            onSubmit={handleLogin}
            sx={{
              p: 4,
              backdropFilter: "blur(20px)",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.1)",
            }}
          >
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="E-mail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ mr: 1, color: "primary.main" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    backdropFilter: "blur(10px)",
                    background: "rgba(255, 255, 255, 0.05)",
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 4 }}>
              <TextField
                fullWidth
                label="Senha"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ mr: 1, color: "primary.main" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    backdropFilter: "blur(10px)",
                    background: "rgba(255, 255, 255, 0.05)",
                  },
                }}
              />
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              type="submit"
              sx={{
                py: 1.5,
                background: "linear-gradient(135deg, #7C3AED 0%, #0891B2 100%)",
                "&:hover": {
                  boxShadow: "0 20px 40px rgba(124, 58, 237, 0.3)",
                },
              }}
            >
              Entrar
            </Button>
            {error && (
              <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
                {error}
              </Typography>
            )}
            {loading && (
              <Typography color="primary" sx={{ mb: 2, textAlign: "center" }}>
                Validando credenciais...
              </Typography>
            )}

          </Card>

          <Typography
            variant="body2"
            sx={{
              textAlign: "center",
              mt: 4,
              color: "text.secondary",
            }}
          >
            © 2025 Event Manager
          </Typography>
        </MotionBox>
      </Container>
    </Box>
  )
}
