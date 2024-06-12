import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Sensors from './Sensors';
import SignIn from './SignIn';
import useAuth from './useAuth';
import Login from './Login';

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
            <Sensors />
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
