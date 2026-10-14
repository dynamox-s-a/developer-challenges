import { Suspense, lazy } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { Provider } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { DashboardLayout } from "@web/components/layout/DashboardLayout";
import { LoginPage } from "@web/features/auth/LoginPage";
import { RequireAuth } from "@web/features/auth/RequireAuth";
import { paths } from "@web/routes/paths";
import { theme } from "@web/theme";
import { store } from "./store";

/**
 * Pages are loaded on demand so the first paint (login) does not carry the
 * dashboard code. It also keeps the charting library out of the initial
 * bundle, since only the time-series page needs it.
 */
const OverviewPage = lazy(() =>
  import("@web/features/overview/OverviewPage").then((module) => ({
    default: module.OverviewPage,
  })),
);
const MachinesPage = lazy(() =>
  import("@web/features/machines/MachinesPage").then((module) => ({
    default: module.MachinesPage,
  })),
);
const MonitoringPointsPage = lazy(() =>
  import("@web/features/monitoring-points/MonitoringPointsPage").then(
    (module) => ({ default: module.MonitoringPointsPage }),
  ),
);
const TimeSeriesPage = lazy(() =>
  import("@web/features/time-series/TimeSeriesPage").then((module) => ({
    default: module.TimeSeriesPage,
  })),
);

/** Shown while a lazily loaded page is fetched. */
function RouteFallback() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
      <CircularProgress aria-label="Loading page" />
    </Box>
  );
}

/**
 * Route table.
 *
 * Everything except `/login` sits behind `RequireAuth`, so no private route
 * can be reached without a validated session.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path={paths.login} element={<LoginPage />} />
      <Route element={<RequireAuth />}>
        <Route
          element={
            <Suspense fallback={<RouteFallback />}>
              <DashboardLayout />
            </Suspense>
          }
        >
          <Route path={paths.overview} element={<OverviewPage />} />
          <Route path={paths.machines} element={<MachinesPage />} />
          <Route
            path={paths.monitoringPoints}
            element={<MonitoringPointsPage />}
          />
          <Route path={paths.timeSeries} element={<TimeSeriesPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to={paths.overview} replace />} />
    </Routes>
  );
}

/** Application root: store, theme and router providers. */
export function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}
