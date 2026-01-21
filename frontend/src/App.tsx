import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Signup } from './pages/Signup';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/signup" element={<Signup />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<div><h1>Rotas privadas</h1></div>}/>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard"/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App