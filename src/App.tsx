import { CssBaseline, ThemeProvider } from '@mui/material'
import { Routes } from './routes'
import { theme } from './theme'
import './theme/fonts.css'
import { Helmet, HelmetProvider } from 'react-helmet-async'

// import './App.css'

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <HelmetProvider>
          <Helmet titleTemplate="%s | Dynamox" />
          <Routes />
        </HelmetProvider>
      </ThemeProvider>
    </>
  )
}

export default App
