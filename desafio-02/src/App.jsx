import { Routes, Route, Navigate, Outlet  } from 'react-router-dom'
import Login from './'
import './styles/App.css'

function PrivateRoute() {
  const { isAuth } = useAppSelector((state) => state.auth)
  if (!isAuth) return <Navigate to="/login" replace />
  return <Outlet />
}

function App() {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path="/user" element={<PrivateRoute />}>
        <Route path="/user" element={ <UserDashboard /> }>
          <Route path="/user/productsList" element={ <Products /> } />
          <Route path="/user/addProduct" element={ <AddProduct /> } />
          <Route path="/user/editProduct" element={ <EditProduct /> } />
          <Route path="/user/removeProduct" element={ <DeleteProduct /> } />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
