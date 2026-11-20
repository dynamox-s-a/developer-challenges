import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './layout/app-layout';
import { HealthPage } from '../features/health/health-page';
import { MachinesPage } from '../features/machines/machines-page';
import { MonitoringPointsPage } from '../features/monitoring-points/monitoring-points-page';

export function App() {
  return (
    <Routes>
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
