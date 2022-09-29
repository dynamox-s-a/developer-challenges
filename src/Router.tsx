import { Routes, Route } from 'react-router-dom'

import { Login } from './pages/Login'
import { Home } from './pages/Home'
import { Create } from './pages/Create'
import { Edit } from './pages/Edit'

import { DefaultLayout } from './layouts/DefaultLayout'

export function Router() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<DefaultLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
        <Route path="/edit" element={<Edit />} />
      </Route>
    </Routes>
  )
}
