import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectLoading, selectError } from "@/domain/data/selectors";
import { dataFetchRequested } from "@/domain/data/actions";
import { Container, Button, Alert, Typography } from "@mui/material";
import MachineHeader from "./components/MachineHeader";
import ChartsGroup from "./components/charts/ChartsGroup";

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

      {loading && <p>Carregando…</p>}

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

      {!loading && !error && (
        <>
          <MachineHeader />
          <ChartsGroup />
        </>
      )}
    </Container>
  );
}
