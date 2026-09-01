import { lazy, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { registerUnauthorizedHandler } from './api/client';
import { AppShell } from './components/AppShell';
import { RequireAuth } from './components/RequireAuth';
import { restoreSession, sessionExpired } from './features/auth/authSlice';
import { LoginPage } from './pages/LoginPage';
import { useAppDispatch } from './store';

const OperationalDashboard = lazy(async () => {
  const module = await import('./components/dashboard/OperationalDashboard');
  return { default: module.OperationalDashboard };
});
const MachinesListPage = lazy(async () => {
  const module = await import('./pages/resources/MachinesListPage');
  return { default: module.MachinesListPage };
});

const MachineFormPage = lazy(async () => {
  const module = await import('./pages/resources/MachineFormPage');
  return { default: module.MachineFormPage };
});

const PointFormPage = lazy(async () => {
  const module = await import('./pages/resources/PointFormPage');
  return { default: module.PointFormPage };
});
const TimeWindowPage = lazy(async () => {
  const module = await import('./pages/investigation/TimeWindowPage');
  return { default: module.TimeWindowPage };
});

const MachinePage = lazy(async () => {
  const module = await import('./pages/resources/MachinePage');
  return { default: module.MachinePage };
});

const MonitoringPointPage = lazy(async () => {
  const module = await import('./pages/resources/MonitoringPointPage');
  return { default: module.MonitoringPointPage };
});

const SensorPage = lazy(async () => {
  const module = await import('./pages/investigation/SensorPage');
  return { default: module.SensorPage };
});

const AcquisitionPage = lazy(async () => {
  const module = await import('./pages/investigation/AcquisitionPage');
  return { default: module.AcquisitionPage };
});

const RawSamplesPage = lazy(async () => {
  const module = await import('./pages/investigation/RawSamplesPage');
  return { default: module.RawSamplesPage };
});

const AlertsListPage = lazy(async () => {
  const module = await import('./pages/alerts/AlertsListPage');
  return { default: module.AlertsListPage };
});

const AlertDetailPage = lazy(async () => {
  const module = await import('./pages/alerts/AlertDetailPage');
  return { default: module.AlertDetailPage };
});

const MonitoringPointsPanel = lazy(async () => {
  const module = await import('./components/MonitoringPointsPanel');
  return { default: module.MonitoringPointsPanel };
});

/**
 * `/assets/...` foi a primeira forma da árvore analítica. A rota canônica passou a ser
 * `/machines/...` — a mesma da entidade — e o endereço antigo redireciona preservando o
 * recorte temporal, para que nenhum link já compartilhado deixe de funcionar.
 */
function CanonicalMachineRedirect(): JSX.Element {
  const { pathname, search } = useLocation();
  return <Navigate to={`${pathname.replace(/^\/assets/, '/machines')}${search}`} replace />;
}

export function App(): JSX.Element {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Tratamento central de 401: qualquer resposta não autorizada derruba a sessão.
    registerUnauthorizedHandler(() => dispatch(sessionExpired()));
    void dispatch(restoreSession());
    return () => registerUnauthorizedHandler(null);
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        }
      >
        <Route index element={<OperationalDashboard />} />

        {/*
          Uma rota por recurso, e a MESMA rota para operação e cadastro: /machines/P-101 é
          a máquina — não existe uma página "analítica" e outra "de cadastro" disputando
          quem representa o ativo. Listar, criar e editar têm endereços próprios, porque
          cada um é uma tela, não um estado escondido de um painel.
        */}
        <Route path="/machines" element={<MachinesListPage />} />
        <Route path="/machines/new" element={<MachineFormPage mode="create" />} />
        <Route path="/machines/:machineKey" element={<MachinePage />} />
        <Route path="/machines/:machineKey/edit" element={<MachineFormPage mode="edit" />} />
        <Route path="/machines/:machineKey/points/new" element={<PointFormPage />} />
        <Route path="/machines/:machineKey/points/:pointKey" element={<MonitoringPointPage />} />
        <Route path="/monitoring-points" element={<MonitoringPointsPanel />} />

        {/* Alertas: episódios persistidos, com endereço próprio — a lista recortada e cada episódio. */}
        <Route path="/alerts" element={<AlertsListPage />} />
        <Route path="/alerts/:id" element={<AlertDetailPage />} />

        {/* Investigação: cada rota é um nível do drill-down, com o recorte na URL. */}
        <Route path="/monitoring/windows/:date/:hour" element={<TimeWindowPage />} />
        <Route path="/sensors/:serialNumber" element={<SensorPage />} />
        <Route path="/acquisitions/:cycleId" element={<AcquisitionPage />} />
        <Route path="/acquisitions/:cycleId/samples" element={<RawSamplesPage />} />

        {/* Endereços antigos continuam abrindo: link colado não pode virar 404. */}
        <Route path="/assets/:machineKey" element={<CanonicalMachineRedirect />} />
        <Route path="/assets/:machineKey/points/:pointKey" element={<CanonicalMachineRedirect />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
