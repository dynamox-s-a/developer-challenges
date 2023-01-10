import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/login_page/Login';

function App() {
  return (
    <Routes>
      <Route path="/" element={ <Login /> } />
    </Routes>
  );
}

export default App;
