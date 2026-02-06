import * as React from 'react';
import type { RouteObject } from 'react-router-dom';
import { Navigate, Outlet } from 'react-router-dom';
import { paths } from '@/paths';

// Layouts
const DashboardLayout = React.lazy(() => import('@/layouts/dashboard-layout'));
const AuthLayout = React.lazy(() => import('@/components/auth/layout').then(m => ({ default: m.Layout })));

// Pages
const SignInPage = React.lazy(() => import('@/pages/auth/sign-in'));
const SignUpPage = React.lazy(() => import('@/pages/auth/sign-up'));
const AccountPage = React.lazy(() => import('@/pages/dashboard/account'));
const OverviewPage = React.lazy(() => import('@/pages/dashboard/overview'));
const NotFoundPage = React.lazy(() => import('@/pages/not-found'));
const MachinePage = React.lazy(() => import('@/pages/machine/machine'));

const MachineDetailPage = React.lazy(() => import('@/pages/machine/machine-detail-page'));
const MonitoringPointsPage = React.lazy(() => import('@/pages/monitoring-point/monitoring-points-page'));

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
    element: <DashboardLayout />,
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
        path: 'monitoring-points',
        element: <MonitoringPointsPage />,
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
