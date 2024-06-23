import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import SignIn from './SignIn';
import Login from './Login';
import Machines from './Machines';
import useAuth from './useAuth';
import EditMachine from './EditMachine';
import CreateMachine from './CreateMachine';
import Sensors from './Sensors';
import CreateSensor from './CreateSensor';
import EditSensor from './EditSensor';
import './index.css';
import ErrorPage from './error-page';

export default function App() {
  return (
    <Routes>
      <Route index element={<Login />} />
      <Route path="login" element={<Login />} />
      <Route path="sign-in" element={<SignIn />} />
      <Route
        path="machines"
        element={
          <RequireAuth>
            <Machines />
          </RequireAuth>
        }
      />
      <Route
        path="create-machine"
        element={
          <RequireAuth>
            <CreateMachine />
          </RequireAuth>
        }
      />
      <Route
        path="edit-machine/:machine"
        element={
          <RequireAuth>
            <EditMachine />
          </RequireAuth>
        }
      />
      <Route
        path="sensors/:machine"
        element={
          <RequireAuth>
            <Sensors />
          </RequireAuth>
        }
      />
      <Route
        path="create-sensor/:machine"
        element={
          <RequireAuth>
            <CreateSensor />
          </RequireAuth>
        }
      />
      <Route
        path="edit-sensor/:machine/:sensor"
        element={
          <RequireAuth>
            <EditSensor />
          </RequireAuth>
        }
      />
      <Route path="/*" element={<ErrorPage />} />
    </Routes>
  );
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const location = useLocation();

  return auth?.authed === true ? (
    children
  ) : (
    <Navigate to="/login" replace state={{ path: location.pathname }} />
  );
}
