import { Routes, Route, Navigate } from 'react-router-dom'
import { 
  Login, 
  User, 
  Home, 
  Machine,
  Point, 
  Sensor
} from '../pages'
import { Layout } from '../components'
import { ReactNode } from 'react'

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem('authToken')
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return children
}

export const RoutesConfig = () => {
  const isAuthenticated = localStorage.getItem('authToken')

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
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="home" element={<Home />} />
        <Route path="users/edit/:id" element={<User />} />
        <Route path="machines/create" element={<Machine />} />
        <Route path="machines/edit/:id" element={<Machine />} />
        <Route path="points/create" element={<Point />} />
        <Route path="points/edit/:id" element={<Point />} />
        <Route path="sensors/create" element={<Sensor />} />
        <Route path="sensors/edit/:id" element={<Sensor />} />
      </Route>
      <Route 
        path="*" 
        element={isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />}
      />
    </Routes>
  )
}
