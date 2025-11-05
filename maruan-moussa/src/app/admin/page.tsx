"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Box, Typography } from "@mui/material";

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight={700}>
        Painel do Administrador
      </Typography>
      <Typography sx={{ mt: 2 }}>
        Aqui o administrador poderá gerenciar os eventos.
      </Typography>
    </Box>
    </ProtectedRoute>
  );
}
