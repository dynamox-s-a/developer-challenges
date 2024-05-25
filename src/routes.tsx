import { createBrowserRouter } from "react-router-dom";
import { NotFound } from "./Pages/404";
import { Data } from "./Pages/Home/data";
import { AppLayout } from "./Layout/app-layout";
import { Home } from "./Pages/Home/home";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/data', element: <Data /> },
    ],
  },
])