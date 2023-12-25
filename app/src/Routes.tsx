import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Data from './pages/Data';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import WrapPage from './components/WrapPage';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WrapPage />}>
          <Route index path="/" element={<Home />} />
          <Route path="/data" element={<Data />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
