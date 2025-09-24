import { Box, Button, Typography } from "@mui/material";

export default function AddNewEventButton({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <Button
      variant="contained"
      color="primary"
      size="large"
      onClick={onClick}
      sx={{ p: 2 }}
    >
      <Box>
        <Typography variant="subtitle1" fontWeight="bold">
          Cadastrar Novo Evento
        </Typography>
      </Box>
    </Button>
  );
}
