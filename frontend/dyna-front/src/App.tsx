import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Container } from '@mui/material';
//import HeaderComponent from './components/Header';
import HomePage from './pages/Home';
import AboutPage from './pages/About';
import SidebarComponent from './components/SidebarComponent';
import NewSignIn from './components/NewSignIn';

function AppContent() {
  const location = useLocation();
  const isSignInPage = location.pathname === '/signin';

  if (isSignInPage) {
    return <NewSignIn />;
  }

  return (
    <>
      <SidebarComponent/>
      <Container>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />          
        </Routes>
      </Container>
    </>
  );
}

function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<NewSignIn />} />
        <Route path="/*" element={<AppContent />} />
      </Routes>
    </Router>
  )
}

export default App
