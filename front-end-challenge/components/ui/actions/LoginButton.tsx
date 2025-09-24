import { Login } from "@mui/icons-material";
import { Button } from "@mui/material";

export default function LoginButton({ loading }: { loading: boolean }) {
  return (
    <Button
      type="submit"
      fullWidth
      variant="contained"
      size="large"
      startIcon={<Login />}
      disabled={loading}
      sx={{ mt: 2 }}
    >
      {loading ? "Entrando..." : "Entrar"}
    </Button>
  );
}
