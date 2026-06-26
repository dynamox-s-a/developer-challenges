import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashBoardPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/data" element={<DashboardPage />} />
        <Route path="/" element={<Navigate to="/data" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;