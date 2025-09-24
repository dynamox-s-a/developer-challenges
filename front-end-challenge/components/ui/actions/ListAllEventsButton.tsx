import { Box, Button, Typography } from "@mui/material";

export default function ListAllEventsButton({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <Button
      variant="outlined"
      color="primary"
      size="large"
      onClick={onClick}
      sx={{ p: 2 }}
    >
      <Box>
        <Typography variant="subtitle1" fontWeight="bold">
          Ver Todos os Eventos
        </Typography>
      </Box>
    </Button>
  );
}
