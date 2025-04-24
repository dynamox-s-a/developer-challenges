import { CssBaseline, ThemeProvider } from '@mui/material'
import { HelmetProvider } from 'react-helmet-async'
import { Routes } from './routes'
import { theme } from './theme'
import { Seo } from './seo'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HelmetProvider>
        {/* Configuração dos meta tags padrão */}
        <Seo />

        <Routes />
      </HelmetProvider>
    </ThemeProvider>
  )
}

export default App
