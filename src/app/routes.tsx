import { Navigate, createBrowserRouter } from 'react-router-dom';
import DataPage from '@/pages/DataPage';
import NotFoundPage from '@/pages/NotFoundPage';

export const router = createBrowserRouter([
	{ path: '/', element: <Navigate to="/data" replace /> },
	{ path: '/data', element: <DataPage /> },
	{ path: '*', element: <NotFoundPage /> },
]);
