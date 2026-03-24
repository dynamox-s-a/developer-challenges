import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#D71920'
    },
    secondary: {
      main: '#94A3B8'
    },
    background: {
      default: '#0B1220',
      paper: '#0F172A'
    },
    text: {
      primary: '#E2E8F0',
      secondary: '#94A3B8'
    },
    divider: 'rgba(148, 163, 184, 0.18)'
  },
  shape: {
    borderRadius: 12
  },
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
    h4: { fontWeight: 900, letterSpacing: -0.3, color: '#E2E8F0' },
    h6: { fontWeight: 900, color: '#E2E8F0' },
    body1: { color: '#E2E8F0' },
    body2: { color: '#94A3B8' }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0B1220'
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(15, 23, 42, 0.86)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(148, 163, 184, 0.14)'
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(10px)',
          borderRight: '1px solid rgba(148, 163, 184, 0.14)'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 800,
          borderRadius: 12
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#0F172A',
          border: '1px solid rgba(148, 163, 184, 0.14)',
          boxShadow: '0 12px 35px rgba(0,0,0,0.35)'
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 900,
          color: '#E2E8F0',
          backgroundColor: 'rgba(148, 163, 184, 0.06)',
          borderBottom: '1px solid rgba(148, 163, 184, 0.14)'
        },
        body: {
          color: '#E2E8F0',
          borderBottom: '1px solid rgba(148, 163, 184, 0.10)'
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(148, 163, 184, 0.06)',
          borderRadius: 12
        },
        notchedOutline: {
          borderColor: 'rgba(148, 163, 184, 0.18)'
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#94A3B8'
        }
      }
    }
  }
})
