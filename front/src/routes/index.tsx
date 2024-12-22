import { Routes, Route, Navigate } from 'react-router-dom'
import { Login } from '../Login'
import { Layout } from '../components'

export const RoutesConfig = () => {
  const isAuthenticated = true

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route 
        path="/*" 
        element={isAuthenticated ?  <Layout /> : <Navigate to="/login" replace />}
      >
        <Route path="home" element={<div>Home</div>} />
        <Route path="users/create" element={<div>Criação de Usuário</div>} />
        <Route path="users/edit/:id" element={<div>Edição de Usuário</div>} />
        <Route path="machines/create" element={<div>Criação de Máquina</div>} />
        <Route path="machines/edit/:id" element={<div>Edição de Máquina</div>} />
        <Route path="sensors/create" element={<div>Criação de Sensor</div>} />
        <Route path="sensors/edit/:id" element={<div>Edição de Sensor</div>} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
