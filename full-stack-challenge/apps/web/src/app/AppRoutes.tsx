import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { PrivateRoute } from '../layouts/PrivateRoute';
import { DEFAULT_PRIVATE_PATH, LoginPage } from '../pages/LoginPage';
import { MachineDetailPage } from '../pages/MachineDetailPage';
import { MachinesListPage } from '../pages/MachinesListPage';
import { MonitoringPointsListPage } from '../pages/MonitoringPointsListPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { SeriesPage } from '../pages/SeriesPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<PrivateRoute />}>
        <Route element={<AppLayout />}>
          <Route
            index
            element={<Navigate to={DEFAULT_PRIVATE_PATH} replace />}
          />
          <Route path="/machines" element={<MachinesListPage />} />
          <Route path="/machines/:id" element={<MachineDetailPage />} />
          <Route
            path="/monitoring-points"
            element={<MonitoringPointsListPage />}
          />
          <Route
            path="/monitoring-points/:id/series"
            element={<SeriesPage />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
