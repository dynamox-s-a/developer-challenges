import { CssBaseline, ThemeProvider } from '@mui/material';
import { useMemo } from 'react';
import { createAppTheme } from '../theme/createAppTheme';
import { AppRoutes } from './AppRoutes';
import { useAppSelector } from './hooks';

/** Theme root: rebuilds the MUI theme only when the colour mode changes. */
export function App() {
  const colorMode = useAppSelector((state) => state.ui.colorMode);
  const theme = useMemo(() => createAppTheme(colorMode), [colorMode]);

  return (
    <ThemeProvider theme={theme}>
      {/* Also sets `color-scheme`, so native controls follow the mode. */}
      <CssBaseline enableColorScheme />
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
