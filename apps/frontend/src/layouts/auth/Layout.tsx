import Image from 'next/image';
import NextLink from 'next/link';
import { FC, ReactNode } from 'react';
import { Logo } from '../../components/Logo';
import authImg from "../../../public/assets/dynamox/logo-dynamox.png";
import { Box, Typography, Unstable_Grid2 as Grid } from '@mui/material';

interface LayoutProps {
  children: ReactNode;
  subtitle?: string;
}

const Layout: FC<LayoutProps> = ({ children, subtitle }) => {
  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        flex: '1 1 auto'
      }}
    >
      <Grid
        container
        sx={{ flex: '1 1 auto' }}
      >
        <Grid
          xs={12}
          lg={6}
          sx={{
            backgroundColor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          }}
        >
          <Box
            component="header"
            sx={{
              left: 0,
              p: 3,
              position: 'fixed',
              top: 0,
              width: '100%'
            }}
          >
            <Box
              component={NextLink}
              href="/"
              sx={{
                display: 'inline-flex',
                height: 32,
                width: 32
              }}
            >
              <Logo />
            </Box>
          </Box>
          {children}
        </Grid>
        <Grid
          xs={12}
          lg={6}
          sx={{
            alignItems: 'center',
            background: 'radial-gradient(50% 50% at 50% 50%, #692746 0%, #280a18 100%)',
            color: 'white',
            display: 'flex',
            gap: '2rem',
            justifyContent: 'center',
            '& img': {
              maxWidth: '100%'
            }
          }}
        >
          <Box sx={{ p: 3 }}>
            <Typography
              align="center"
              color="inherit"
              sx={{
                fontSize: '24px',
                lineHeight: '32px',
                mb: 1
              }}
              variant="h1"
            >
              Welcome to{' '}
              <Box
                component="a"
                sx={{ color: '#ffffff' }}
                target="_blank"
              >
                Dynamox
              </Box>
            </Typography>
            <Typography
              align="center"
              sx={{ mb: 3 }}
              variant="subtitle1"
            >
              {subtitle}
            </Typography>
            <Image
              alt=""
              priority
              width={261}
              height={108}
              style={{ width: '100%' }}
              src={authImg.src}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

Layout.defaultProps = {
  subtitle: 'Change subtitle text in the Layout component'
}

export default Layout;
