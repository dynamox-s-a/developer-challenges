import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './layout/app-layout';
import { LoginPage } from '../features/auth/login-page';
import { HealthPage } from '../features/health/health-page';
import { MachinesPage } from '../features/machines/machines-page';
import { MonitoringPointsPage } from '../features/monitoring-points/monitoring-points-page';

export function App() {
  return (
    <Routes>
      {/* Pública e fora do layout (sem barra e sem menu) */}
      <Route path="/login" element={<LoginPage />} />

      {/* Rota de layout: não tem path, só "embrulha" as páginas */}
      <Route element={<AppLayout />}>
        <Route path="/machines" element={<MachinesPage />} />
        <Route path="/monitoring-points" element={<MonitoringPointsPage />} />
        <Route path="/status" element={<HealthPage />} />
      </Route>

      {/* Qualquer outra URL (inclusive "/") vai para máquinas */}
      <Route path="*" element={<Navigate to="/machines" replace />} />
    </Routes>
  );
}

export default App;