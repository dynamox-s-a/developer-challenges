"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Box, Typography } from "@mui/material";

export default function ReaderPage() {
  return (
    <ProtectedRoute requiredRole="reader">
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight={700}>
        Lista de Eventos
      </Typography>
      <Typography sx={{ mt: 2 }}>
        Aqui o leitor poderá visualizar e filtrar os eventos disponíveis.
      </Typography>
    
    </Box>
    </ProtectedRoute>
  );
}
