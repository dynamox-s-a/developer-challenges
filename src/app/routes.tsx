import { Navigate, createBrowserRouter, type RouteObject } from 'react-router-dom';
import DataPage from '@/pages/DataPage';
import NotFoundPage from '@/pages/NotFoundPage';

export const appRoutes: RouteObject[] = [
	{ path: '/', element: <Navigate to="/data" replace /> },
	{ path: '/data', element: <DataPage /> },
	{ path: '*', element: <NotFoundPage /> },
];

export const router = createBrowserRouter(appRoutes);
