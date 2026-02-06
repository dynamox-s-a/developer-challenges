import * as React from 'react';
import type { RouteObject } from 'react-router-dom';
import { Navigate, Outlet } from 'react-router-dom';
import { paths } from '@/paths';
import { ProtectedRoute } from '@/components/auth/protected-route';

const DashboardLayout = React.lazy(() => import('@/layouts/dashboard-layout'));
const AuthLayout = React.lazy(() => import('@/components/auth/layout').then(m => ({ default: m.Layout })));

const SignInPage = React.lazy(() => import('@/pages/auth/sign-in'));
const SignUpPage = React.lazy(() => import('@/pages/auth/sign-up'));
const AccountPage = React.lazy(() => import('@/pages/dashboard/account'));
const OverviewPage = React.lazy(() => import('@/pages/dashboard/overview'));
const NotFoundPage = React.lazy(() => import('@/pages/not-found'));
const MachinePage = React.lazy(() => import('@/pages/machine/machine'));
const MachineDetailPage = React.lazy(() => import('@/pages/machine/machine-detail-page'));
const MonitoringPointsPage = React.lazy(() => import('@/pages/monitoring-point/monitoring-points-page'));
const SensorsPage = React.lazy(() => import('@/pages/sensors/sensors-page'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to={paths.dashboard.overview} replace />,
  },
  {
    path: 'auth',
    element: <AuthLayout children={<Outlet />} />,
    children: [
      {
        path: 'sign-in',
        element: <SignInPage />,
      },
      {
        path: 'sign-up',
        element: <SignUpPage />,
      },
    ],
  },
  {
    path: 'dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <OverviewPage />,
      },
      {
        path: 'machine',
        element: <MachinePage />,
      },
      {
        path: 'machine/:id',
        element: <MachineDetailPage />,
      },
      {
        path: 'turbines/:id',
        element: <MachineDetailPage />,
      },
      {
        path: 'monitoring-points',
        element: <MonitoringPointsPage />,
      },
      {
        path: 'sensors',
        element: <SensorsPage />,
      },
      {
        path: 'account',
        element: <AccountPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];
