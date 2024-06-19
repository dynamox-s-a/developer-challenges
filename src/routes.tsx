import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Graficos from './pages/graficos';

/**
 * 
 * @returns 
 * Controlador de rotas
 */
const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dados" element={<Graficos />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;