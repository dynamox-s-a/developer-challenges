import { Outlet, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Sensors from './Sensors';
import SignIn from './SignIn';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Login />} />
        <Route path="sign-in" element={<SignIn />} />
        <Route path="machines" element={<Sensors />} />
        <Route path="sensors" element={<Sensors />} />
      </Route>
    </Routes>
  );
}

function Layout() {
  return (
    <div className="vh-100 d-flex">
      <Outlet />
    </div>
  );
}
