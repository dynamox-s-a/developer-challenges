import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/login';
import { Machines } from './pages/Machines';
import { Layout } from './components/Layout';
import { useSelector } from 'react-redux';
import { type RootState } from './store';
import type { JSX } from 'react';
import { Sensors } from './pages/Sensors';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

// Criei o tema com a cor da empresa
const appTheme = createTheme({
  palette: {
    primary: {
      main: '#64213b', 
    },
    secondary: {
      main: '#333333',
    },
    background: {
      default: '#f4f6f8',
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  }
});

// criei um componente que protege as rotas privadas verificando autenticação
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  // extraio o status de autenticação do estado global
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  // renderizo o componente com o Layout se autenticado, senão redireciono para login
  return isAuthenticated ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

// defino o componente principal da aplicação com todas as rotas
function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <Routes>
        {/* defino a rota pública de login */}
        <Route path="/login" element={<Login />} />
        
        {/* defino a rota privada de máquinas protegida por autenticação */}
        <Route 
          path="/machines" 
          element={
            <PrivateRoute>
              <Machines />
            </PrivateRoute>
          } 
        />
        
        {/* defino a rota privada de sensores protegida por autenticação */}
        <Route 
          path="/sensors" 
          element={
            <PrivateRoute>
              <Sensors />
            </PrivateRoute>
          } 
        />
        
        {/* redireciono a rota raiz para máquinas */}
        <Route path="/" element={<Navigate to="/machines" replace />} />
        
        {/* redireciono qualquer rota desconhecida para login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </ThemeProvider>
  )
}
// exporto o componente App como padrão
export default App
