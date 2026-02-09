import { useState, PropsWithChildren, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import paths from 'routes/paths';
import Sidebar from 'layouts/main-layout/sidebar';
import Topbar from './topbar';
import Footer from './footer';

const MainLayout = ({ children }: PropsWithChildren) => {
  const { data: session, status } = useSession();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      navigate(paths.signin);
    }
  }, [status, navigate]);

  if (status === 'loading') {
    return (
      <Stack width={1} height="100vh" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Stack>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <Stack width={1} minHeight="100vh">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} setIsClosing={setIsClosing} />
      <Stack
        component="main"
        direction="column"
        px={3.5}
        flexGrow={1}
        width={{ xs: 1, lg: 'calc(100% - 290px)' }}
      >
        <Topbar isClosing={isClosing} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        {children}
        {/* <Footer /> */}
      </Stack>
    </Stack>
  );
};

export default MainLayout;
