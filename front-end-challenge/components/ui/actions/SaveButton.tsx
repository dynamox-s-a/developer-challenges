import { Button } from "@mui/material";

export default function SaveButton({ loading }: { loading: boolean }) {
  return (
    <Button
      type="submit"
      variant="contained"
      color="primary"
      disabled={loading}
    >
      {loading ? "Salvando..." : "Salvar"}
    </Button>
  );
}
