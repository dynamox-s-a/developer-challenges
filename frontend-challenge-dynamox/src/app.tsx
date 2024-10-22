import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { Login } from "./pages/login";
import { Dashboard } from './pages/dashboard';
import { SignUp } from './pages/signup';
import { ProtectedRoute } from './components/auth/protected-route';
import { CreateMachine } from './components/dashboard/create-machine';
import { CreateMonitoringPoint } from './components/dashboard/create-monitor-point';
import { CreateSensor } from './components/dashboard/create-sensor';
import { UserProfile } from './components/dashboard/user-profile';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to='/login' replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard/overview" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/create-machine" element={<ProtectedRoute><CreateMachine /></ProtectedRoute>} />
          <Route path="/dashboard/create-monitoring-point" element={<ProtectedRoute><CreateMonitoringPoint /></ProtectedRoute>} />
          <Route path="/dashboard/create-sensor" element={<ProtectedRoute><CreateSensor /></ProtectedRoute>} />
          <Route path="/dashboard/settings-user" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
