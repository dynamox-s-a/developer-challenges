import { Routes, Route, Navigate } from 'react-router-dom'
import { Login, User } from '../pages'
import { Layout } from '../components'
import { UserReduxState } from '../redux'
import { useSelector } from 'react-redux'

export const RoutesConfig = () => {
  const user = useSelector((state: { user: UserReduxState }) => state.user)
  const isAuthenticated = user?.id

  return (
    <Routes>
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/home" replace /> : <Login />}
      />
      <Route 
        path="/users/create" 
        element={isAuthenticated ? <Navigate to="/home" replace /> : <User />} 
      />
      <Route 
        path="/*" 
        element={isAuthenticated ? <Layout /> : <Navigate to="/login" replace />}
      >
        <Route path="home" element={<div>Home</div>} />
        <Route path="users/edit/:id" element={<User />} />
        <Route path="machines/create" element={<div>Criação de Máquina</div>} />
        <Route path="machines/edit/:id" element={<div>Edição de Máquina</div>} />
        <Route path="sensors/create" element={<div>Criação de Sensor</div>} />
        <Route path="sensors/edit/:id" element={<div>Edição de Sensor</div>} />
      </Route>
      <Route 
        path="*" 
        element={isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />}
      />
    </Routes>
  )
}
