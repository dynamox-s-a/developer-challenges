import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Data from '../pages/Data';

export function AppRouters() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/data" element={<Data />} />
      </Routes>
    </BrowserRouter>
  );
}
