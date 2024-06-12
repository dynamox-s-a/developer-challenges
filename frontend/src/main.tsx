import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes.tsx';
import './index.css';

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <Login />,
//     errorElement: <ErrorPage />,
//   },
//   {
//     path: '/login',
//     element: <Login />,
//     errorElement: <ErrorPage />,
//   },{
//     path: '/sensors',
//     element: <Sensors />,
//     errorElement: <ErrorPage />,
//   },

// ]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <RouterProvider router={router} /> */}
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </React.StrictMode>
);
