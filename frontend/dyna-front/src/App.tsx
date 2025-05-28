import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
//import HeaderComponent from './components/Header';
import HomePage from './pages/Home';
import AboutPage from './pages/About';
import SidebarComponent from './components/SidebarComponent.';

function App() {


  return (
    <>
      <Router>
        <SidebarComponent/>
        <Container>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </Container>
      </Router>
    </>
  )
}

export default App
