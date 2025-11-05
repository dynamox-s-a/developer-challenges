"use client"
import { motion } from "framer-motion";
import { Box, Button, Card, Container, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { CalendarMonth } from "@mui/icons-material";
import Header from "@/components/Header";

const MotionBox = motion(Box)
const MotionButton = motion(Button)

export default function Home() {
  const router = useRouter()

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "-50%",
          right: "-10%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, transparent 70%)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-30%",
          left: "-5%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(8, 145, 178, 0.1) 0%, transparent 70%)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          sx={{ textAlign: "center" }}
        >
          {/* Card com Glassmorphism */}
          <Card
            sx={{
              p: 6,
              backdropFilter: "blur(20px)",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.1)",
              mb: 4,
            }}
          >
            {/* Ícone de calendário com animação */}
            <MotionBox
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 3,
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, #7C3AED 0%, #0891B2 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 20px 40px rgba(124, 58, 237, 0.2)",
                }}
              >
                <CalendarMonth sx={{ fontSize: 48, color: "white" }} />
              </Box>
            </MotionBox>

            {/* Título */}
            <Typography
              variant="h2"
              sx={{
                mb: 2,
                background: "linear-gradient(135deg, #7C3AED 0%, #0891B2 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              Event Manager
            </Typography>

            {/* Descrição */}
            <Typography
              variant="body1"
              sx={{
                mb: 4,
                color: "text.secondary",
                fontSize: "1.1rem",
                lineHeight: 1.6,
              }}
            >
              Sistema moderno e intuitivo para gestão completa de eventos. Organize, controle e maximize o sucesso dos
              seus eventos.
            </Typography>

            {/* Botão Principal com degradê e animação */}
            <MotionButton
              variant="contained"
              size="large"
              onClick={() => router.push("/login")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              sx={{
                width: "100%",
                py: 1.5,
                fontSize: "1.1rem",
                background: "linear-gradient(135deg, #7C3AED 0%, #0891B2 100%)",
                boxShadow: "0 10px 25px rgba(124, 58, 237, 0.3)",
                "&:hover": {
                  boxShadow: "0 20px 40px rgba(124, 58, 237, 0.4)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              Acessar Sistema
            </MotionButton>
          </Card>

          {/* Rodapé */}
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              mt: 4,
            }}
          >
            © 2025 Event Manager. Todos os direitos reservados.
          </Typography>
        </MotionBox>
      </Container>
    </Box>
  )
}
