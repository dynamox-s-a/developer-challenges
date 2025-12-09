import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/MainLayout';
import { MachinesPages } from './pages/MachinesPages';
import { PointsPage } from './pages/PointsPages';

export function App() {

  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/machines" replace />} />
          
          <Route path="/machines" element={<MachinesPages />} />
          
          <Route path="/points" element={<PointsPage/>} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;