import { createBrowserRouter } from "react-router-dom";
import { NotFound } from "./Pages/404";
import { Data } from "./Pages/Data/data";
import { AppLayout } from "./layout/app-layout";
import { Home } from "./Pages/Home/home";
import { Edu } from "./Pages/Edu/edu";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/data', element: <Data /> },
      { path: '/edu', element: <Edu /> },
    ],
  },
])