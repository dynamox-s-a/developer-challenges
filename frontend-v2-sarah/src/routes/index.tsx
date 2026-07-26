import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
        <Route path="/data" element={<Data />} />
      </Routes>
    </BrowserRouter>
  );
}
