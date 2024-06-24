import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import Login from './Login';
import SignIn from './SignIn';
import useAuth from './useAuth';
import Sensors from './Sensors';
import Monitor from './Monitor';
import Machines from './Machines';
import ErrorPage from './error-page';
import EditSensor from './EditSensor';
import EditMachine from './EditMachine';
import CreateSensor from './CreateSensor';
import CreateMachine from './CreateMachine';
import './index.css';

export default function App() {
  return (
    <Routes>
      <Route index element={<Login />} />
      <Route path="login" element={<Login />} />
      <Route path="sign-in" element={<SignIn />} />
      <Route element={<RequireAuth />}>
        <Route path="monitor" element={<Monitor />} />
        <Route path="machines" element={<Machines />} />
        <Route path="create-machine" element={<CreateMachine />} />
        <Route path="edit-machine/:machine" element={<EditMachine />} />
        <Route path="sensors/:machine" element={<Sensors />} />
        <Route path="create-sensor/:machine" element={<CreateSensor />} />
        <Route path="edit-sensor/:machine/:sensor" element={<EditSensor />} />
      </Route>
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

function RequireAuth() {
  const auth = useAuth();
  const location = useLocation();

  return auth?.authed === true ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ path: location.pathname }} />
  );
}
