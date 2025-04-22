import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import {PrivateRoute} from './routes/PrivateRoute';
import Sidebar from './components/sidebar/sidebar';
import Content from './components/content/content';
import Home from './pages/home/Home';
import Machines from './pages/machines/Machines';
import Points from './pages/points/Points';
import Login from './pages/login/Login';

function AppLayout() {
const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <Box sx={{ display: 'flex' }}>
      {!isLoginPage && <Sidebar />}
      <Content>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/machines" element={<PrivateRoute><Machines /></PrivateRoute>} />
          <Route path="/points" element={<PrivateRoute><Points /></PrivateRoute>} />
        </Routes>
      </Content>
    </Box>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
