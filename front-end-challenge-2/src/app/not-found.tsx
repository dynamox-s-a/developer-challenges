"use client";

import { Box, Container, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { Home, ArrowBack } from "@mui/icons-material";

export default function NotFound() {
  const router = useRouter();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: 3,
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "6rem", md: "8rem" },
            fontWeight: 700,
            background: "linear-gradient(45deg, #1976d2, #42a5f5)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          404
        </Typography>

        <Typography variant="h4" component="h1" gutterBottom>
          Página não encontrada
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          A página que você está procurando não existe ou foi movida.
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            startIcon={<Home />}
            onClick={() => router.push("/")}
            size="large"
          >
            Ir para Início
          </Button>

          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => router.back()}
            size="large"
          >
            Voltar
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
