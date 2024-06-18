import './App.css'

import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import DataPage from './pages/DataPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DataPage />} />
      </Routes>
    </Router>
  )
}

export default App
