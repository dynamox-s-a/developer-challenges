import { Navigate, Route, Routes } from 'react-router-dom';
import Data from './pages/Data';

function App() {
  return (
    <Routes>
      <Route path="/data" element={<Data />} />
      <Route path="*" element={<Navigate to="/data" replace />} />
    </Routes>
  );
}

export default App;
