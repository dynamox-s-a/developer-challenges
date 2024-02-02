import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Home } from "./pages/Home"
import { Data } from "./pages/Data"
import { ThemeProvider, createTheme } from "@mui/material"

const App = () => {
  // initialize a browser router
  const theme = createTheme({
    palette: {
      primary: {
        main: "#45132d",
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          colorPrimary: {
            backgroundColor: "white",
          },
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          primary: {
            color: "white",
            backgroundColor: "white",
          },
          // colorPrimary: {
          //   backgroundColor: "white",
          // },
        },
      },
    },
  })
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

  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
