"use client";

import { Box, Typography, Container, Paper } from "@mui/material";

export default function NotFound() {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 6,
            borderRadius: 4,
            maxWidth: 500,
            width: "100%",
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "6rem", md: "8rem" },
              fontWeight: "bold",
              color: "primary.main",
              lineHeight: 0.8,
              mb: 2,
            }}
          >
            404
          </Typography>

          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: "medium",
              mb: 2,
            }}
          >
            Página não encontrada
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, lineHeight: 1.6 }}
          >
            Ops! A página que você está procurando não existe ou foi movida.
            Verifique se a URL está correta ou volte para a página inicial.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
