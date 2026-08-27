import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './hooks';
import { restoreSession } from '../features/auth/authSlice';
import { AppLayout } from '../components/AppLayout';
import { PrivateRoute } from '../components/PrivateRoute';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';
import { MachinesPage } from '../pages/MachinesPage';
import { MonitoringPointsPage } from '../pages/MonitoringPointsPage';
import { TimeSeriesPage } from '../pages/TimeSeriesPage';

export default function App() {
  const dispatch = useAppDispatch();
  const { accessToken, initialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (accessToken && !initialized) {
      dispatch(restoreSession());
    }
  }, [accessToken, initialized, dispatch]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<PrivateRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="machines" element={<MachinesPage />} />
          <Route path="monitoring-points" element={<MonitoringPointsPage />} />
          <Route path="monitoring-points/:pointId/time-series" element={<TimeSeriesPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
