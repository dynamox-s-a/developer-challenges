import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import GpsFixedOutlinedIcon from "@mui/icons-material/GpsFixedOutlined";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";
import PrecisionManufacturingOutlinedIcon from "@mui/icons-material/PrecisionManufacturingOutlined";
import SpeedOutlinedIcon from "@mui/icons-material/SpeedOutlined";
import {
  Alert,
  AppBar,
  Box,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { useEffect, useMemo } from "react";
import type { ElementType } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store";
import { dashboardPalette } from "../../../theme";
import { SyncedCharts } from "./SyncedCharts";
import { telemetryActions } from "../model/telemetrySlice";
import { buildDashboardCharts } from "../lib/transform";

function resolveIcon(icon: unknown): ElementType {
  return typeof icon === "object" && icon !== null && "default" in icon
    ? (icon as { default: ElementType }).default
    : (icon as ElementType);
}

const machineInfo = [
  {
    label: "Máquina 1023",
    icon: resolveIcon(PrecisionManufacturingOutlinedIcon),
  },
  { label: "Ponto 20192", icon: resolveIcon(GpsFixedOutlinedIcon) },
  { label: "200", icon: resolveIcon(SpeedOutlinedIcon) },
  { label: "16g", icon: resolveIcon(MonitorHeartOutlinedIcon) },
  { label: "20 min", icon: resolveIcon(AccessTimeOutlinedIcon) },
];

export function DataPage() {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector(
    (state: RootState) => state.telemetry,
  );
  const charts = useMemo(() => buildDashboardCharts(data), [data]);
  const hasPoints = charts.some((chart) =>
    chart.series.some((series) => series.data.length > 0),
  );

  useEffect(() => {
    dispatch(telemetryActions.fetchRequested());
    return () => {
      dispatch(telemetryActions.fetchCancelled());
    };
  }, [dispatch]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar
        position="static"
        color="inherit"
        elevation={0}
        sx={{
          borderTop: `4px solid ${dashboardPalette.appBarTopBorder}`,
          borderBottom: `1px solid ${dashboardPalette.appBarBottomBorder}`,
          bgcolor: "background.paper",
        }}
      >
        <Toolbar sx={{ minHeight: "72px !important", px: { xs: 2, sm: 3.5 } }}>
          <Typography
            component="h1"
            variant="h5"
            sx={{ fontWeight: 700, color: dashboardPalette.pageTitle }}
          >
            Análise de Dados
          </Typography>
        </Toolbar>
      </AppBar>

      <Container
        component="main"
        maxWidth={false}
        sx={{
          bgcolor: "background.default",
          px: { xs: 2, sm: 3.5 },
          py: { xs: 2, sm: 3.5 },
        }}
      >
        <Stack spacing={3.5} sx={{ mx: { xs: 0, lg: "10vw" } }}>
          <Paper
            component="header"
            elevation={0}
            variant="outlined"
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(5, 1fr)" },
              borderColor: dashboardPalette.sectionBorder,
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            {machineInfo.map(({ label, icon: Icon }, index) => (
              <Box
                key={label}
                sx={{
                  minHeight: 50,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1.25,
                  px: 2,
                  borderRight: {
                    md:
                      index === machineInfo.length - 1
                        ? 0
                        : `1px solid ${dashboardPalette.metadataDivider}`,
                  },
                  borderBottom: {
                    xs:
                      index === machineInfo.length - 1
                        ? 0
                        : `1px solid ${dashboardPalette.metadataDivider}`,
                    md: 0,
                  },
                }}
              >
                <Icon
                  sx={{ fontSize: 21, color: dashboardPalette.metadataText }}
                />
                <Typography
                  sx={{ fontSize: 16, color: dashboardPalette.metadataText }}
                >
                  {label}
                </Typography>
              </Box>
            ))}
          </Paper>
          <Paper
            elevation={0}
            variant="outlined"
            sx={{
              borderColor: dashboardPalette.sectionBorder,
              p: { xs: 1.5, sm: 3 },
              bgcolor: "background.paper",
            }}
          >
            {status === "loading" && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress aria-label="Carregando dados" />
              </Box>
            )}
            {status === "failed" && <Alert severity="error">{error}</Alert>}
            {status === "succeeded" && !hasPoints && (
              <Alert severity="info">
                Não há leituras disponíveis para exibir.
              </Alert>
            )}
            {status === "succeeded" && hasPoints && (
              <SyncedCharts charts={charts} />
            )}
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
