import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  LinearProgress,
  Typography,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import type { MetricKey } from "../../features/data/types";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  fetchDataRequested,
  selectCharts,
  selectDataError,
  selectDataStatus,
  selectMachine,
} from "../../features/data/dataSlice";
import { useEffect } from "react";
import MachineInfoBar from "../components/MachineInfoBar";
import ChartCard from "../components/ChartCard";
import TimeSeriesChart from "../components/TimeSeriesChart";

type ChartConfig = {
  metric: MetricKey;
  title: string;
  yAxisTitle: string;
  decimals: number;
};

const CHARTS: ChartConfig[] = [
  {
    metric: "acceleration",
    title: "Aceleração RMS",
    yAxisTitle: "Aceleração RMS (g)",
    decimals: 3,
  },
  {
    metric: "temperature",
    title: "Temperatura",
    yAxisTitle: "Temperatura (°C)",
    decimals: 1,
  },
  {
    metric: "velocity",
    title: "Velocidade RMS",
    yAxisTitle: "Velocidade RMS (mm/s)",
    decimals: 2,
  },
];

function DataPage() {
  const dispatch = useAppDispatch();
  const machine = useAppSelector(selectMachine);
  const charts = useAppSelector(selectCharts);

  const status = useAppSelector(selectDataStatus);
  const error = useAppSelector(selectDataError);

  const hasData = machine !== null && charts !== null;
  const isLoading = status === "loading";
  const isEmpty =
    charts !== null &&
    Object.values(charts).every((series) =>
      series.every(({ data }) => data.length === 0),
    );

  const loadData = () => dispatch(fetchDataRequested());

  useEffect(() => {
    dispatch(fetchDataRequested());
  }, [dispatch]);
  return (
    <>
      <Box component="header" sx={styles.header}>
        <Typography variant="h6" component="h1">
          Análise de Dados
        </Typography>
      </Box>
      <Container component="main" maxWidth={false} sx={styles.main}>
        {isLoading && hasData && (
          <LinearProgress aria-label="Atualizando dados" />
        )}
        {isLoading && !hasData && (
          <Box sx={styles.center}>
            <CircularProgress aria-label="Carregando dados" />
          </Box>
        )}
        {status === "failed" && (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={loadData}>
                Tentar novamente
              </Button>
            }
          >
            Não foi possível carregar os dados. {error}
          </Alert>
        )}
        {machine && <MachineInfoBar machine={machine} />}
        {isEmpty && <Alert severity="info">Nenhum dado disponível.</Alert>}
        {charts && !isEmpty && (
          <Box sx={styles.panel}>
            {CHARTS.map(({ metric, title, yAxisTitle, decimals }) => (
              <ChartCard key={metric} title={title}>
                <TimeSeriesChart
                  series={charts[metric]}
                  yAxisTitle={yAxisTitle}
                  valueDecimals={decimals}
                />
              </ChartCard>
            ))}
          </Box>
        )}
      </Container>
    </>
  );
}

export default DataPage;

const styles = {
  header: {
    bgcolor: "background.paper",
    borderBottom: 1,
    borderColor: "divider",
    px: { xs: 2, md: 3 },
    py: 2,
  },
  main: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    py: 2,
    px: { xs: 2, md: 3 },
  },
  panel: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    p: 2,
    bgcolor: "background.default",
    border: 1,
    borderColor: "divider",
    borderRadius: 1,
  },
  center: {
    display: "flex",
    justifyContent: "center",
    py: 8,
  },
} satisfies Record<string, SxProps<Theme>>;
