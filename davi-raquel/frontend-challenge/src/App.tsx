import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Home } from "./pages/Home"
import { Data } from "./pages/Data"

const App = () => {
  // initialize a browser router
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    // other pages....
    {
      path: "/data",
      element: <Data />,
    },
  ])

  return <RouterProvider router={router} />
}

export default App
