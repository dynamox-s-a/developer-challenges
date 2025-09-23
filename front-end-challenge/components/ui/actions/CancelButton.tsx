import { Button } from "@mui/material";

export default function CancelButton({
  onClick,
  loading,
}: {
  onClick: () => void;
  loading: boolean;
}) {
  return (
    <Button
      variant="outlined"
      color="secondary"
      onClick={onClick}
      disabled={loading}
    >
      Cancelar
    </Button>
  );
}
