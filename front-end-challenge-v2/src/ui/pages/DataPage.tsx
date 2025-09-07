import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Alert,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { dataFetchRequested } from "@/domain/data/actions";
import { selectError, selectLoading } from "@/domain/data/selectors";

export default function DataPage() {
  const dispatch = useDispatch();
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  useEffect(() => {
    dispatch(dataFetchRequested());
  }, [dispatch]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dados da Máquina
      </Typography>

      {loading && (
        <Stack direction="row" alignItems="center" spacing={2}>
          <CircularProgress size={24} /> <span>Carregando séries...</span>
        </Stack>
      )}

      {error && (
        <Alert
          severity="error"
          sx={{ my: 2 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => dispatch(dataFetchRequested())}
            >
              Tentar novamente
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Aqui entratão o MachineHeader e o ChartsGroup */}

      {!loading && !error && (
        <Typography variant="body2" color="text.secondary">
          Dados carregados com sucesso!
        </Typography>
      )}
    </Container>
  );
}
