---
name: mui6-theming
description: Create and customize Material UI 6 themes with TypeScript, including custom color palettes, typography, component overrides, dark mode, and responsive design. Use when setting up MUI theme provider, creating custom themes, styling components, implementing dark/light mode toggle, or building responsive layouts with MUI.
---

# Material UI 6 Theming

## Overview

This skill provides comprehensive guidance for implementing Material UI 6 with custom theming in Next.js applications using TypeScript.

## Initial Setup

### Installation

```bash
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled @emotion/cache
```

### Next.js App Router Integration

```tsx
// lib/theme.ts
'use client';

import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// Custom color palette
const palette = {
  primary: {
    main: '#1976d2',
    light: '#42a5f5',
    dark: '#1565c0',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#9c27b0',
    light: '#ba68c8',
    dark: '#7b1fa2',
    contrastText: '#ffffff',
  },
  error: {
    main: '#d32f2f',
  },
  warning: {
    main: '#ed6c02',
  },
  info: {
    main: '#0288d1',
  },
  success: {
    main: '#2e7d32',
  },
  background: {
    default: '#f5f5f5',
    paper: '#ffffff',
  },
};

// Create base theme
let theme = createTheme({
  palette,
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none', // Disable uppercase
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8, // Default spacing unit (8px)
});

// Apply responsive font sizes
theme = responsiveFontSizes(theme);

export default theme;
```

### Component Overrides

```tsx
// lib/theme.ts (continued)
let theme = createTheme({
  // ... palette and typography
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          transition: 'box-shadow 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'medium',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        },
      },
      defaultProps: {
        elevation: 0,
      },
    },
  },
});
```

### Theme Provider Setup

```tsx
// app/providers/ThemeProvider.tsx
'use client';

import { ThemeProvider as MUIThemeProvider, CssBaseline } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import theme from '@/lib/theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </AppRouterCacheProvider>
  );
}
```

### Root Layout Integration

```tsx
// app/layout.tsx
import { ThemeProvider } from './providers/ThemeProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

## Dark Mode Implementation

### Theme with Mode Support

```tsx
// lib/theme.ts
'use client';

import { createTheme, PaletteMode } from '@mui/material/styles';

export const getTheme = (mode: PaletteMode) => {
  return createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            // Light mode colors
            primary: {
              main: '#1976d2',
            },
            background: {
              default: '#f5f5f5',
              paper: '#ffffff',
            },
            text: {
              primary: 'rgba(0, 0, 0, 0.87)',
              secondary: 'rgba(0, 0, 0, 0.6)',
            },
          }
        : {
            // Dark mode colors
            primary: {
              main: '#90caf9',
            },
            background: {
              default: '#121212',
              paper: '#1e1e1e',
            },
            text: {
              primary: '#ffffff',
              secondary: 'rgba(255, 255, 255, 0.7)',
            },
          }),
    },
    // ... rest of theme config
  });
};
```

### Theme Context with Toggle

```tsx
// contexts/ThemeContext.tsx
'use client';

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  ReactNode,
} from 'react';
import { ThemeProvider as MUIThemeProvider, PaletteMode } from '@mui/material';
import { getTheme } from '@/lib/theme';

interface ThemeContextType {
  mode: PaletteMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleTheme: () => {},
});

export const useThemeMode = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<PaletteMode>('light');

  useEffect(() => {
    // Check for saved preference or system preference
    const savedMode = localStorage.getItem('theme-mode') as PaletteMode;
    if (savedMode) {
      setMode(savedMode);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setMode('dark');
    }
  }, []);

  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme-mode', newMode);
      return newMode;
    });
  };

  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MUIThemeProvider theme={theme}>{children}</MUIThemeProvider>
    </ThemeContext.Provider>
  );
}
```

### Theme Toggle Component

```tsx
// components/ThemeToggle.tsx
'use client';

import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useThemeMode } from '@/contexts/ThemeContext';

export function ThemeToggle() {
  const { mode, toggleTheme } = useThemeMode();

  return (
    <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
      <IconButton onClick={toggleTheme} color="inherit">
        {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
      </IconButton>
    </Tooltip>
  );
}
```

## Responsive Design Patterns

### Breakpoints Usage

```tsx
// components/ResponsiveLayout.tsx
'use client';

import { Box, Container, Grid, useTheme, useMediaQuery } from '@mui/material';

export function ResponsiveLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 2, sm: 3, md: 4 },
          p: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {/* Responsive content */}
      </Box>
    </Container>
  );
}
```

### Grid System

```tsx
// components/EventsGrid.tsx
import { Grid, Card, CardContent, Typography } from '@mui/material';

export function EventsGrid({ events }: { events: Event[] }) {
  return (
    <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
      {events.map((event) => (
        <Grid
          item
          key={event.id}
          xs={12}      // Full width on mobile
          sm={6}       // 2 columns on tablet
          md={4}       // 3 columns on desktop
          lg={3}       // 4 columns on large screens
        >
          <Card>
            <CardContent>
              <Typography variant="h6">{event.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {event.location}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
```

## Common UI Patterns

### App Bar with Navigation

```tsx
// components/AppBar.tsx
'use client';

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useState } from 'react';

export function Header() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <AppBar position="sticky" color="default">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          sx={{ display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Event Management
        </Typography>

        <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2 }}>
          <Button color="inherit">Events</Button>
          <Button color="inherit">Dashboard</Button>
        </Box>

        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
          <Avatar sx={{ width: 32, height: 32 }} />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem>Profile</MenuItem>
          <MenuItem>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
```

### Form with Validation Feedback

```tsx
// components/EventForm.tsx
'use client';

import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Stack,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface FormErrors {
  name?: string;
  date?: string;
  location?: string;
  description?: string;
  category?: string;
}

export function EventForm() {
  const [errors, setErrors] = useState<FormErrors>({});

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box component="form" noValidate sx={{ mt: 2 }}>
        <Stack spacing={3}>
          <TextField
            required
            fullWidth
            label="Event Name"
            error={!!errors.name}
            helperText={errors.name}
          />

          <DateTimePicker
            label="Date and Time *"
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!errors.date,
                helperText: errors.date,
              },
            }}
          />

          <TextField
            required
            fullWidth
            label="Location"
            error={!!errors.location}
            helperText={errors.location}
          />

          <TextField
            required
            fullWidth
            multiline
            rows={4}
            label="Description"
            error={!!errors.description}
            helperText={errors.description || 'Minimum 50 characters'}
          />

          <FormControl fullWidth error={!!errors.category}>
            <InputLabel>Category *</InputLabel>
            <Select label="Category *">
              <MenuItem value="Conference">Conference</MenuItem>
              <MenuItem value="Workshop">Workshop</MenuItem>
              <MenuItem value="Webinar">Webinar</MenuItem>
              <MenuItem value="Networking">Networking</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
            {errors.category && (
              <FormHelperText>{errors.category}</FormHelperText>
            )}
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
          >
            Create Event
          </Button>
        </Stack>
      </Box>
    </LocalizationProvider>
  );
}
```

### Data Table

```tsx
// components/EventsTable.tsx
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  IconButton,
  Chip,
  TablePagination,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

export function EventsTable({ events }: { events: Event[] }) {
  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel>Name</TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel>Date</TableSortLabel>
              </TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id} hover>
                <TableCell>{event.name}</TableCell>
                <TableCell>
                  {new Date(event.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell>
                  <Chip label={event.category} size="small" />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small">
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error">
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={100}
        page={0}
        onPageChange={() => {}}
        rowsPerPage={10}
        onRowsPerPageChange={() => {}}
      />
    </Paper>
  );
}
```

## Styled Components Pattern

```tsx
// components/StyledCard.tsx
'use client';

import { styled } from '@mui/material/styles';
import { Card, CardContent } from '@mui/material';

export const EventCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
  '& .MuiCardContent-root': {
    padding: theme.spacing(3),
  },
}));

export const GradientButton = styled('button')(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
  border: 0,
  borderRadius: theme.shape.borderRadius,
  color: 'white',
  padding: theme.spacing(1.5, 4),
  boxShadow: '0 3px 5px 2px rgba(25, 118, 210, .3)',
  cursor: 'pointer',
  fontSize: '1rem',
  fontWeight: 600,
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));
```

## Best Practices

1. **Use `sx` prop for one-off styles** - Avoid creating styled components for single-use styles
2. **Theme everything** - Use theme values instead of hardcoded colors/spacing
3. **Responsive by default** - Use breakpoint-aware values in sx prop
4. **Component overrides for consistency** - Define global component styles in theme
5. **Use semantic colors** - primary, secondary, error, warning, info, success
6. **Avoid inline styles** - Use sx prop or styled components
7. **Test dark mode** - Ensure all components work in both modes
