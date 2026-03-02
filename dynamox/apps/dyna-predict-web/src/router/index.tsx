import { createBrowserRouter } from 'react-router-dom';
import LoginPage from '../app/pages/LoginPage';
import MainDashboard from '../app/pages/MainDashboard';
import MachinesPage from '../app/pages/MachinesPage';
import MonitoringPointsPage from '../app/pages/MonitoringPointsPage';
import NotFoundPage from '../app/pages/NotFoundPage';
import { authLoader, rootLoader, guestLoader } from './loaders';
import AuthLayout from '../components/layout/AuthLayout';
import { routePaths } from './paths';

const externalRoutes = [
  {
    path: routePaths.root,
    loader: rootLoader,
  },
  {
    path: 'auth/login',
    loader: guestLoader,
    Component: LoginPage,
  },
  {
    path: '*',
    Component: NotFoundPage,
  },
];

const authenticatedRoutes = [
  {
    Component: AuthLayout,
    loader: authLoader,
    children: [
      { path: routePaths.dashboard, Component: MainDashboard },
      { path: routePaths.machines, Component: MachinesPage },
      { path: routePaths.monitoringPoints, Component: MonitoringPointsPage },
    ],
  },
];

export const router = createBrowserRouter([...externalRoutes, ...authenticatedRoutes]);
