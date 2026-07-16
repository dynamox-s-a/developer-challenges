import { createBrowserRouter, Navigate } from 'react-router';

import { DataView } from 'src/sections/data/data-view';

export const router = createBrowserRouter([
  { index: true, element: <Navigate to="/data" replace /> },
  { path: 'data', element: <DataView /> },
  { path: '*', element: <Navigate to="/data" replace /> },
]);
