import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Flowchart from './Pages/Flowchart';
import Header from './Components/Header';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <main className="AppBody">
          <Routes>
            <Route path="/data" element={<Flowchart />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
