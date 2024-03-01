import Box from '@mui/material/Box';
import React from 'react';
import Header from '../../core/components/header';
import Show from '../../core/components/show';
import { Copyright } from '../../page';
import { useAuthContext } from '../providers/auth-provider';
import LoggedIn from './logged-in';
import LoginForm from './login-form';

export interface LoginContentProps {
  onDrawerToggle?: () => void;
}
const LoginContent: React.FC<LoginContentProps> = () => {
  const { signIn, isAuthenticated } = useAuthContext();

  console.log({ isAuthenticated });
  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Box component="main" sx={{ flex: 1, py: 6, px: 4, bgcolor: '#eaeff1' }}>
        <Show when={isAuthenticated}>
          <LoggedIn />
        </Show>
        <Show when={!isAuthenticated}>
          <LoginForm signIn={signIn} />
        </Show>
      </Box>
      <Box component="footer" sx={{ p: 2, bgcolor: '#eaeff1' }}>
        <Copyright />
      </Box>
    </Box>
  );
};

export default LoginContent;
