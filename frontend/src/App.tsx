import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Sensors from './Sensors';
import SignIn from './SignIn';
import Login from './Login';
import Machines from './Machines';
import useAuth from './useAuth';
import EditMachine from './EditMachine';
import CreateMachine from './CreateMachine';
import MachineSensors from './MachineSensors';
import CreateSensor from './CreateSensor';
import './index.css';

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
        path="edit-machine/:id"
        element={
          <RequireAuth>
            <EditMachine />
          </RequireAuth>
        }
      />
      <Route
        path="machine-sensors/:id"
        element={
          <RequireAuth>
            <MachineSensors />
          </RequireAuth>
        }
      />
      <Route
        path="sensors"
        element={
          <RequireAuth>
            <Sensors />
          </RequireAuth>
        }
      />
      <Route
        path="create-sensor/:id"
        element={
          <RequireAuth>
            <CreateSensor />
          </RequireAuth>
        }
      />
      <Route path="/*" element={<Navigate to={'/'} />} />
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
