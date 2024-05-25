import { Button, Container } from '@mui/material';
import dyanamoxLogo from '../../assets/dynamoxRedLogo.svg';
import { HeaderNav } from "./header-nav";
import './header.styles'
import { HeaderContainer } from "./header.styles";
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export function Header(){
  // Validação tamanho da tela
  const [isSmallScreen, setisSmallScreen] = useState(false)

  const { pathname } = useLocation()

  useEffect(() => {
    // Function to check screen size
    function checkScreenSize() {
      setisSmallScreen(window.innerWidth <= 768)
    }

    // Initial check
    checkScreenSize()

    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize)

    // Cleanup event listener on component unmount
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  return (
    <HeaderContainer>
        <Container sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <Link to="/">
            <img src={dyanamoxLogo} style={{ maxHeight: '40px', width: 'auto'}} alt="Dynamo Logo Branca" />
          </Link>    
          
          <HeaderNav type={isSmallScreen ? 'mobile' : 'desktop'} />

          {!isSmallScreen && <Button href='/data' variant={pathname === '/data' ? 'contained' : 'outlined'}>
            Data
          </Button>}

        </Container>
    </HeaderContainer>
  )
}