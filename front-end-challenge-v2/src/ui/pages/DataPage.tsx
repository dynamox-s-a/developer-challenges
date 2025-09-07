import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectLoading, selectError } from "@/domain/data/selectors";
import { dataFetchRequested } from "@/domain/data/actions";
import { Container, Button, Alert } from "@mui/material";
import MachineHeader from "./components/MachineHeader";

export default function DataPage() {
  const dispatch = useDispatch();

  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  useEffect(() => {
    dispatch(dataFetchRequested());
  }, [dispatch]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
        </>
      )}
    </Container>
  );
}
