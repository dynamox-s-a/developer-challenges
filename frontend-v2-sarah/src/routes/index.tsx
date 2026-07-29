import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Data from '../pages/Data';

export function AppRouters() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/" element={<Navigate to="/data" replace />} />
        <Route path="/data" element={<Data />} />
      </Routes>
    </BrowserRouter>
  );
}
