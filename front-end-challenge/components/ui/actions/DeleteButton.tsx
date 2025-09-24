import { Button } from "@mui/material";

export default function DeleteButton({
  onClick,
  loading,
}: {
  onClick: () => void;
  loading: boolean;
}) {
  return (
    <Button
      variant="contained"
      color="error"
      onClick={onClick}
      disabled={loading}
    >
      Excluir
    </Button>
  );
}
