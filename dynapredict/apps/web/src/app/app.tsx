import { Navigate, Route, Routes } from 'react-router-dom';
import { HealthPage } from '../features/health/health-page';
import { MachinesPage } from '../features/machines/machines-page';
import { MonitoringPointsPage } from '../features/monitoring-points/monitoring-points-page';

export function App() {
  return (
    <Routes>
      <Route path="/machines" element={<MachinesPage />} />
      <Route path="/monitoring-points" element={<MonitoringPointsPage />} />
      <Route path="/status" element={<HealthPage />} />

      {/* Qualquer outra URL (inclusive "/") vai para máquinas */}
      <Route path="*" element={<Navigate to="/machines" replace />} />
    </Routes>
  );
}

export default App;