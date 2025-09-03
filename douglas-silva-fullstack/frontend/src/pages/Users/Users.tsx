import { Box, Paper, Typography } from "@mui/material";

export default function Users() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Usuários</Typography>
      <Paper sx={{ p: 3 }}>
        <Typography color="text.secondary">
          Página em construção. Em breve você poderá gerenciar usuários aqui.
        </Typography>
      </Paper>
    </Box>
  );
}
