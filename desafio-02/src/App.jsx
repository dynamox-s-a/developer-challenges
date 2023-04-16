import { useSelector } from 'react-redux'
import { Routes, Route, Navigate, Outlet  } from 'react-router-dom'
import AddProducts from './pages/AddProducts'
import DeleteProduct from './pages/DeleteProduct'
import EditProduct from './pages/EditProduct'
import Login from './pages/Login'
import Products from './pages/Products'
import UserDashboard from './pages/UserDashboard'
import './styles/App.css'

function PrivateRoute() {
  const { userToken } = useSelector((state) => state.auth)
  if (!userToken) return <Navigate to="/" replace />
  return <Outlet />
}

function App() {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path="/user" element={<PrivateRoute />}>
        <Route path="/user" element={ <UserDashboard /> }>
          <Route path="/user/productsList" element={ <Products /> } />
          <Route path="/user/addProduct" element={ <AddProducts /> } />
          <Route path="/user/editProduct" element={ <EditProduct /> } />
          <Route path="/user/removeProduct" element={ <DeleteProduct /> } />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
