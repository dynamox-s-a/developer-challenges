import { ReactElement } from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'

import { Login } from './pages/Login'
import { Home } from './pages/Home'
import { Create } from './pages/Create'
import { Edit } from './pages/Edit'

import { DefaultLayout } from './layouts/DefaultLayout'

import { useAppSelector } from './store/hooks'

function PrivateRoute(): ReactElement {
  const { isAuth } = useAppSelector((state) => state.auth)
  if (!isAuth) return <Navigate to="/login" replace />

  return <Outlet />
}

export function Router() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute />}>
        <Route path="/" element={<DefaultLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/edit/:id" element={<Edit />} />
        </Route>
      </Route>
    </Routes>
  )
}
