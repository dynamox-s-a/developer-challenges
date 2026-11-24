import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './layout/app-layout';
import { LoginPage } from '../features/auth/login-page';
import { RequireAuth } from '../features/auth/require-auth';
import { HealthPage } from '../features/health/health-page';
import { MachinesPage } from '../features/machines/machines-page';
import { MonitoringPointDetailsPage } from '../features/monitoring-points/monitoring-point-details-page';
import { TimeSeriesPage } from '../features/time-series/time-series-page';
import { MonitoringPointsPage } from '../features/monitoring-points/monitoring-points-page';

export function App() {
  return (
    <Routes>
      {/* Pública e fora do layout (sem barra e sem menu) */}
      <Route path="/login" element={<LoginPage />} />

      {/* Tudo aqui dentro exige login */}
      <Route element={<RequireAuth />}>
        {/* Rota de layout: não tem path, só "embrulha" as páginas */}
        <Route element={<AppLayout />}>
          <Route path="/machines" element={<MachinesPage />} />
          <Route path="/monitoring-points" element={<MonitoringPointsPage />} />
          <Route
            path="/monitoring-points/:id"
            element={<MonitoringPointDetailsPage />}
          />
          <Route path="/time-series/:id" element={<TimeSeriesPage />} />
          <Route path="/status" element={<HealthPage />} />
        </Route>
      </Route>

      {/* Qualquer outra URL (inclusive "/") vai para máquinas */}
      <Route path="*" element={<Navigate to="/machines" replace />} />
    </Routes>
  );
}

export default App;
