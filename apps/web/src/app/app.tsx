import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '@/app/pages/auth/Login';
import { Layout } from '@/app/components/Layout';
import { PrivateRoute } from '@/app/components/PrivateRoute';
import { MachinesList } from '@/app/pages/machines/MachinesList';
import { MonitoringPointsList } from '@/app/pages/monitoring-points/MonitoringPointsList';
import { Dashboard } from '@/app/pages/dashboard/Dashboard';

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/machines" element={<MachinesList />} />
          <Route path="/monitoring-points" element={<MonitoringPointsList />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
