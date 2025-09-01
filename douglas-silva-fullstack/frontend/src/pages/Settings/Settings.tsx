import { Box, Paper, Typography } from "@mui/material";

export default function Settings() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Configurações</Typography>
      <Paper sx={{ p: 3 }}>
        <Typography color="text.secondary">
          Página em construção. Ajustes e preferências ficarão aqui.
        </Typography>
      </Paper>
    </Box>
  );
}
