import React, { useMemo } from 'react';
import { Route, Routes, Navigate, Outlet } from 'react-router-dom';
import AddProduct from './components/addProducts';
import Products from './components/products';
import { getLocalStorage } from './helpers/localStorage';
import Login from './pages/login_page/Login';
import UserDashboard from './pages/userDashboard';

export const ProtectedRoute = () => {
  const token = useMemo(() => getLocalStorage<string>("userToken"), []);
  if (!token) {
    return <Navigate to="/" replace />
  }

   return <Outlet />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={ <Login /> } />
      <Route path="/userDashboard" element={ <ProtectedRoute /> }>
        <Route path="/userDashboard" element={ <UserDashboard /> }>
          <Route path="/userDashboard/products" element={ <Products /> } />
          <Route path="/userDashboard/addProduct" element={ <AddProduct /> } />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
