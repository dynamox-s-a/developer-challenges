"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  AppBar,
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Link,
  Paper,
  Skeleton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  ArrowBackRounded,
  CalendarMonthRounded,
  CheckCircleRounded,
  InfoOutlined,
  MoreHorizRounded,
  RefreshRounded,
  SensorsRounded,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  measurementsRequested,
  periodChanged,
} from "./dashboardSlice";
import {
  selectDashboard,
  selectFilteredSeries,
  selectMetricSeries,
} from "./selectors";
import type { AppDispatch } from "./store";
import type { MetricKind } from "./types";
import { SensorChart } from "./SensorChart";

const PERIODS = [
  { label: "7 dias", value: 7 },
  { label: "14 dias", value: 14 },
  { label: "30 dias", value: 30 },
  { label: "Todo período", value: null },
] as const;

const METRICS: MetricKind[] = ["acceleration", "velocity", "temperature"];

function ChartSkeleton() {
  return (
    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
      <Stack direction="row" justifyContent="space-between">
        <Box>
          <Skeleton width={150} height={24} />
          <Skeleton width={230} height={17} />
        </Box>
        <Skeleton width={130} height={26} />
      </Stack>
      <Skeleton variant="rounded" height={220} sx={{ mt: 2 }} />
    </Paper>
  );
}

export function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { status, error, periodDays } = useSelector(selectDashboard);
  const filteredSeries = useSelector(selectFilteredSeries);
  const [activeTimestamp, setActiveTimestamp] = useState<number | null>(null);

  useEffect(() => {
    dispatch(measurementsRequested());
  }, [dispatch]);

  const dateRange = useMemo(() => {
    const timestamps = filteredSeries.flatMap((item) =>
      item.data.map((point) => Date.parse(point.datetime)),
    );
    if (!timestamps.length) return "Período indisponível";
    const format = new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
    return `${format.format(Math.min(...timestamps))} — ${format.format(
      Math.max(...timestamps),
    )}`;
  }, [filteredSeries]);

  const hasData = filteredSeries.some((item) => item.data.length > 0);

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <AppBar
        position="static"
        elevation={0}
        color="inherit"
        sx={{
          bgcolor: "rgba(255,255,255,.94)",
          borderBottom: 1,
          borderColor: "divider",
          backdropFilter: "blur(12px)",
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 60, sm: 68 }, px: { xs: 2, sm: 3 } }}>
          <Stack direction="row" alignItems="center" gap={1.25} flexGrow={1}>
            <Avatar
              variant="rounded"
              sx={{
                width: 34,
                height: 34,
                bgcolor: "primary.main",
                borderRadius: 2,
              }}
            >
              <SensorsRounded fontSize="small" />
            </Avatar>
            <Box>
              <Typography fontWeight={800} lineHeight={1.05}>
                DynaSense
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Monitoramento de ativos
              </Typography>
            </Box>
          </Stack>
          <Tooltip title="Mais opções">
            <IconButton aria-label="Mais opções">
              <MoreHorizRounded />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: { xs: 2.5, md: 4 } }}>
        <Breadcrumbs
          aria-label="Navegação estrutural"
          sx={{ mb: 2, fontSize: 13, color: "text.secondary" }}
        >
          <Link underline="hover" color="inherit" href="#">
            Ativos
          </Link>
          <Link underline="hover" color="inherit" href="#">
            Linha de produção 01
          </Link>
          <Typography color="text.primary" fontSize={13}>
            Motor principal
          </Typography>
        </Breadcrumbs>

        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "flex-start" }}
          gap={2}
          mb={3}
        >
          <Stack direction="row" gap={1.5} alignItems="flex-start">
            <IconButton
              aria-label="Voltar para ativos"
              sx={{ border: 1, borderColor: "divider", bgcolor: "background.paper" }}
            >
              <ArrowBackRounded fontSize="small" />
            </IconButton>
            <Box>
              <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
                <Typography component="h1" variant="h1">
                  Motor principal
                </Typography>
                <Chip
                  icon={<CheckCircleRounded />}
                  label="Operação normal"
                  size="small"
                  color="success"
                  variant="outlined"
                  sx={{ fontWeight: 700, bgcolor: "#f1faf7" }}
                />
              </Stack>
              <Typography color="text.secondary" mt={0.5} fontSize={14}>
                Sensor DYN-0427 · Mancal lado acoplado
              </Typography>
            </Box>
          </Stack>
          <Button
            variant="outlined"
            startIcon={
              status === "loading" ? (
                <CircularProgress size={16} />
              ) : (
                <RefreshRounded />
              )
            }
            onClick={() => dispatch(measurementsRequested())}
            disabled={status === "loading"}
            sx={{ alignSelf: { xs: "stretch", md: "flex-start" } }}
          >
            Atualizar dados
          </Button>
        </Stack>

        <Paper
          variant="outlined"
          sx={{
            p: { xs: 2, sm: 2.5 },
            borderRadius: 3,
            mb: 2,
            boxShadow: "0 1px 2px rgba(25,34,56,.03)",
          }}
        >
          <Stack
            direction={{ xs: "column", lg: "row" }}
            alignItems={{ xs: "stretch", lg: "center" }}
            justifyContent="space-between"
            gap={2}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              divider={<Divider orientation="vertical" flexItem />}
              gap={{ xs: 1.5, sm: 3 }}
            >
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Última coleta
                </Typography>
                <Typography fontSize={14} fontWeight={700}>
                  12 dez 2023, 12:02
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Posição
                </Typography>
                <Typography fontSize={14} fontWeight={700}>
                  Horizontal
                </Typography>
              </Box>
              <Box>
                <Stack direction="row" alignItems="center" gap={0.5}>
                  <Typography variant="caption" color="text.secondary">
                    Qualidade do sinal
                  </Typography>
                  <Tooltip title="Percentual de coletas recebidas no período">
                    <InfoOutlined sx={{ fontSize: 14, color: "text.secondary" }} />
                  </Tooltip>
                </Stack>
                <Typography fontSize={14} fontWeight={700} color="success.main">
                  98,6%
                </Typography>
              </Box>
            </Stack>

            <Stack gap={0.8}>
              <Stack direction="row" alignItems="center" gap={0.75}>
                <CalendarMonthRounded sx={{ fontSize: 16, color: "text.secondary" }} />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  data-testid="date-range"
                >
                  {dateRange}
                </Typography>
              </Stack>
              <Stack direction="row" gap={0.75} flexWrap="wrap">
                {PERIODS.map((period) => (
                  <Chip
                    key={period.label}
                    label={period.label}
                    size="small"
                    clickable
                    color={periodDays === period.value ? "primary" : "default"}
                    variant={periodDays === period.value ? "filled" : "outlined"}
                    onClick={() => dispatch(periodChanged(period.value))}
                    sx={{ fontWeight: 700 }}
                  />
                ))}
              </Stack>
            </Stack>
          </Stack>
        </Paper>

        {status === "failed" && (
          <Alert
            severity="error"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => dispatch(measurementsRequested())}
              >
                Tentar novamente
              </Button>
            }
            sx={{ mb: 2 }}
          >
            {error}
          </Alert>
        )}

        <Stack gap={2}>
          {status === "loading" || status === "idle" ? (
            <>
              <ChartSkeleton />
              <ChartSkeleton />
              <ChartSkeleton />
            </>
          ) : hasData ? (
            METRICS.map((metric) => (
              <SensorChart
                key={metric}
                metric={metric}
                series={selectMetricSeries(filteredSeries, metric)}
                activeTimestamp={activeTimestamp}
                onHoverTimestamp={setActiveTimestamp}
              />
            ))
          ) : (
            <Paper
              variant="outlined"
              sx={{ p: 6, textAlign: "center", borderRadius: 3 }}
            >
              <SensorsRounded color="disabled" sx={{ fontSize: 46 }} />
              <Typography variant="h2" mt={1}>
                Nenhuma medição encontrada
              </Typography>
              <Typography color="text.secondary" mt={0.5}>
                Tente selecionar um período diferente.
              </Typography>
            </Paper>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
