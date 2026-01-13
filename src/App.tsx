import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/login';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/dashboard" element={<h1>Bem-vindo ao Dashboard (Em construção)</h1>} />
    </Routes>
  )
}

export default App
