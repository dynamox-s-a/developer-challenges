import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/login';
import { Machines } from './pages/Machines';
import { Layout } from './components/Layout';
import { useSelector } from 'react-redux';
import { type RootState } from './store';
import type { JSX } from 'react';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  return isAuthenticated ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route 
        path="/machines" 
        element={
          <PrivateRoute>
            <Machines />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/sensors" 
        element={
          <PrivateRoute>
            <div style={{ padding: 20, textAlign: 'center' }}>Página de Sensores (Em construção)</div>
          </PrivateRoute>
        } 
      />
      <Route path="/" element={<Navigate to="/machines" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
