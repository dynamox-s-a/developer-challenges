import { lazy, Suspense, type ReactElement } from 'react';
import type { RouteObject } from 'react-router';
import { LoadingIndicator } from '../components/loading-indicator';
import { ImportPage } from '../features/import/import-page';
import { MachineDetailPage } from '../features/machine-detail/machine-detail-page';
import { MachinesPage } from '../features/machines/machines-page';
import { MonitoringPointsPage } from '../features/monitoring-points/monitoring-points-page';
import { OverviewPage } from '../features/overview/overview-page';
import { SectorsPage } from '../features/sectors/sectors-page';
import { RequireSession } from '../features/session/require-session';
import { AppLayout } from '../layout/app-layout';
import { NAVIGATION } from '../layout/navigation';
import { LoginPage } from '../pages/login-page';
import { NotFoundPage } from '../pages/not-found-page';

/**
 * Loaded on demand: the charts bring Chart.js, about a quarter of the bundle, which no
 * other screen needs.
 */
const PointDetailPage = lazy(() =>
  import('../features/point-detail/point-detail-page').then((module) => ({
    default: module.PointDetailPage,
  })),
);

const loading = <LoadingIndicator label="Loading screen" />;

/** The screen of each menu entry; the type makes a missing one a compile error. */
const SCREENS: Record<(typeof NAVIGATION)[number]['path'], ReactElement> = {
  '/': <OverviewPage />,
  '/sectors': <SectorsPage />,
  '/machines': <MachinesPage />,
  '/monitoring-points': <MonitoringPointsPage />,
  '/import': <ImportPage />,
};

/**
 * Route table, kept apart from the router so tests can mount it in memory. Only the login
 * screen is public; everything else waits for a confirmed session.
 */
export const routes: RouteObject[] = [
  { path: '/login', element: <LoginPage /> },
  {
    element: <RequireSession />,
    children: [
      {
        element: <AppLayout />,
        children: [
          ...NAVIGATION.map((item) => ({
            path: item.path,
            element: SCREENS[item.path],
          })),
          { path: '/machines/:id', element: <MachineDetailPage /> },
          {
            path: '/monitoring-points/:id',
            element: (
              <Suspense fallback={loading}>
                <PointDetailPage />
              </Suspense>
            ),
          },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
];
