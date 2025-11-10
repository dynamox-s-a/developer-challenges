"use client";
import { motion } from "framer-motion";
import {
  Box,
  Button,
  Card,
  Container,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  CalendarMonth,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { login } from "@/store/authSlice";

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const resultAction = await dispatch(login({ email, password }));

    if (login.fulfilled.match(resultAction)) {
      const userRole = resultAction.payload.user.role;
      router.push(userRole === "admin" ? "/admin" : "/reader");
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
        overflow: "hidden",
        px: 2,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "-40%",
          left: "-10%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)",
          filter: "blur(90px)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-30%",
          right: "-10%",
          width: 450,
          height: 450,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(8,145,178,0.1) 0%, transparent 70%)",
          filter: "blur(90px)",
        }}
      />
      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 2 }}>
        <motion.form
          onSubmit={handleLogin}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card
            sx={{
              p: 5,
              backdropFilter: "blur(20px)",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              borderRadius: 4,
              textAlign: "center",
            }}
          >
            <Box sx={{ mb: 4 }}>
              <motion.div
                animate={{
                  y: [0, -8, 0],
                  boxShadow: [
                    "0 20px 40px rgba(124, 58, 237, 0.25)",
                    "0 25px 50px rgba(124, 58, 237, 0.35)",
                    "0 20px 40px rgba(124, 58, 237, 0.25)",
                  ],
                  background: [
                    "linear-gradient(135deg, #7C3AED 0%, #0891B2 100%)",
                    "linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)",
                    "linear-gradient(135deg, #7C3AED 0%, #0891B2 100%)",
                  ],
                }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px auto",
                }}
              >
                <CalendarMonth style={{ fontSize: 48, color: "white" }} />
              </motion.div>
              <Typography
                variant="h3"
                sx={{
                  mb: 1,
                  background:
                    "linear-gradient(135deg, #7C3AED 0%, #0891B2 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: 700,
                }}
              >
                Event Manager
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "text.primary",
                  maxWidth: 380,
                  mx: "auto",
                  lineHeight: 1.6,
                }}
              >
                Sistema moderno e intuitivo para gestão completa de eventos.
                Organize, controle e maximize o sucesso dos seus eventos.
              </Typography>
            </Box>
            <TextField
              fullWidth
              label="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: "primary.main" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  "& fieldset": {
                    borderColor: (theme) =>
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.15)"
                        : "rgba(8,145,178,0.3)", 
                  },
                  "&:hover fieldset": {
                    borderColor: (theme) =>
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.3)"
                        : "rgba(8,145,178,0.5)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: (theme) =>
                      theme.palette.mode === "dark" ? "#7C3AED" : "#0891B2",
                    boxShadow: (theme) =>
                      theme.palette.mode === "dark"
                        ? "0 0 10px rgba(124,58,237,0.3)"
                        : "0 0 6px rgba(8,145,178,0.25)", 
                  },
                },
              }}
            />
            <TextField
              fullWidth
              label="Senha"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: "primary.main" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: "primary.main", mr: "2px" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  "& fieldset": {
                    borderColor: (theme) =>
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.15)"
                        : "rgba(8,145,178,0.3)", 
                  },
                  "&:hover fieldset": {
                    borderColor: (theme) =>
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.3)"
                        : "rgba(8,145,178,0.5)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: (theme) =>
                      theme.palette.mode === "dark" ? "#7C3AED" : "#0891B2",
                    boxShadow: (theme) =>
                      theme.palette.mode === "dark"
                        ? "0 0 10px rgba(124,58,237,0.3)"
                        : "0 0 6px rgba(8,145,178,0.25)",
                  },
                },
              }}
            />
            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{
                py: 1.5,
                background:
                  "linear-gradient(135deg, #7C3AED 0%, #0891B2 100%)",
                "&:hover": { boxShadow: "0 20px 40px rgba(124,58,237,0.3)" },
              }}
            >
              Entrar
            </Button>

            {loading && (
              <Typography sx={{ mt: 2, color: "primary.main" }}>
                Validando credenciais...
              </Typography>
            )}
            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
            <Typography
              variant="body2"
              sx={{
                mt: 5,
                color: "text.secondary",
                background:
                  "linear-gradient(135deg, #7C3AED 0%, #0891B2 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              © 2025 Event Manager. Todos os direitos reservados.
            </Typography>
          </Card>
        </motion.form>
      </Container>
    </Box>
  );
}
