'use client';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Navigator from 'client/src/app/core/components/navigator';
import theme from 'client/src/app/theme';
import * as React from 'react';
import { Match, Switch } from './core/components/switch';
import LoginContent from './login/components/login-content';
import MachinesContent from './machine/components/machines-content';
import SensorsContent from './sensor/components/sensors-content';

export type PageContentType =
  | 'Authentication'
  | 'Machines'
  | 'Sensors'
  | 'Monitoring points';

export const Copyright = () => {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Dynamox
      </Link>{' '}
      {new Date().getFullYear()}.
    </Typography>
  );
};

const drawerWidth = 256;

export default function Index() {
  const [pageContent, setPageContent] =
    React.useState<PageContentType>('Authentication');

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <CssBaseline />
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          {isSmUp ? null : (
            <Navigator
              PaperProps={{ style: { width: drawerWidth } }}
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              onSelect={(pageId) => setPageContent(pageId as PageContentType)}
            />
          )}
          <Navigator
            PaperProps={{ style: { width: drawerWidth } }}
            sx={{ display: { sm: 'block', xs: 'none' } }}
            onSelect={(pageId) => setPageContent(pageId as PageContentType)}
          />
        </Box>
        <Switch key={pageContent}>
          <Match when={pageContent === 'Authentication'}>
            <LoginContent />
          </Match>
          <Match when={pageContent === 'Machines'}>
            <MachinesContent />
          </Match>
          <Match when={pageContent === 'Sensors'}>
            <SensorsContent />
          </Match>
        </Switch>
      </Box>
    </ThemeProvider>
  );
}
