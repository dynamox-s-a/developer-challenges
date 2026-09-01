import { alpha, createTheme } from '@mui/material/styles';

/**
 * Design system do produto — Material UI 5 com a identidade do shell de referência
 * (vision-core): superfícies claras, primária ciano-petróleo, densidade industrial.
 * Nenhuma marca é reproduzida — apenas princípios de densidade, ritmo e hierarquia,
 * reimplementados como tokens de theme.
 *
 * Toda decisão visual do dashboard vive AQUI (paleta, semântica de condição, dimensões
 * de layout, tokens de gráfico), não espalhada pelos componentes.
 */
const BRAND = {
  primary: '#008CA5',
  primaryDark: '#006B80',
  primaryContrast: '#F4FBFE',
  accent: '#12A7BE',
  background: '#F4F7F9',
  surface: '#FFFFFF',
  surfaceAlt: '#FBFCFD',
  onSurface: '#14233B',
  // Texto e estados passam WCAG AA (>= 4,5:1) sobre as três superfícies reais do produto:
  // #FFFFFF (paper), #F8FAFC (drawer) e #F3F5F7 (fundo). Medido, não estimado.
  muted: '#5F6D7C',
  border: '#D7E0E6',
  success: '#008C62',
  warning: '#E66A16',
  error: '#E43E3D',
};

/**
 * Cores semânticas de CONDIÇÃO — o vocabulário visual do condition monitoring.
 * Condição, recência e cobertura são conceitos diferentes e recebem tons diferentes;
 * cor nunca é o único canal (sempre acompanhada de rótulo e, quando preciso, ícone).
 */
const CONDITION = {
  normal: '#00976A',
  observation: '#F2A900',
  attention: '#F04444',
  unclassified: '#7F8996',
  noData: '#B2BAC3',
  stale: '#E58A00',
};

/**
 * Cores de ALERTA — episódios persistidos, com nível A1/A2 e ciclo de vida. Grupo separado
 * de `condition` de propósito: um A1 aberto e uma condição "normal" podem coexistir no
 * mesmo ponto (referências diferentes), e a tela precisa dizer as duas coisas sem que uma
 * pareça a outra.
 */
const ALERT = {
  a1: '#D97706',
  a2: '#C0262C',
  resolved: '#5B6B7A',
  acknowledged: '#2E6FB0',
};

/** Tokens de layout do dashboard: uma fonte só para dimensões repetidas. */
const DASHBOARD = {
  // Dois níveis de texto por item (destino + para que serve) precisam de largura para não
  // truncar; 264 px acomoda a descrição mais longa sem roubar área do conteúdo.
  sidebarWidth: 264,
  appBarHeight: 56,
  pagePaddingX: { xs: 16, md: 24 },
  gridGap: 14,
  sectionGap: 14,
  cardPadding: 16,
  cardRadius: 10,
  headerHeight: 44,
  /**
   * Piso de altura para cards que desenham gráfico — sem ele um Recharts colapsa a zero
   * quando o card tem pouco conteúdo. Tabelas, listas e KPIs não têm piso: assumem a
   * altura do próprio conteúdo e esticam na linha do grid.
   */
  cardMinHeight: {
    chart: 220,
    primaryChart: 340,
    heatmap: 260,
    explorer: 380,
  },
  chart: {
    tickFontSize: 11,
    axisColor: '#556676',
    gridColor: alpha('#556676', 0.14),
    tooltip: {
      background: '#FFFFFF',
      border: '#D6E0E8',
      radius: 8,
      fontSize: 11.5,
      shadow: '0 4px 12px rgba(23, 37, 46, 0.12)',
    },
  },
};

declare module '@mui/material/styles' {
  interface Palette {
    condition: typeof CONDITION;
    alert: typeof ALERT;
  }
  interface PaletteOptions {
    condition?: typeof CONDITION;
    alert?: typeof ALERT;
  }
  interface Theme {
    dashboard: typeof DASHBOARD;
  }
  interface ThemeOptions {
    dashboard?: typeof DASHBOARD;
  }
}

export const theme = createTheme({
  dashboard: DASHBOARD,
  palette: {
    mode: 'light',
    primary: {
      main: BRAND.primary,
      dark: BRAND.primaryDark,
      contrastText: BRAND.primaryContrast,
    },
    secondary: { main: BRAND.accent },
    success: { main: BRAND.success },
    warning: { main: BRAND.warning },
    error: { main: BRAND.error },
    condition: CONDITION,
    alert: ALERT,
    divider: BRAND.border,
    background: { default: BRAND.background, paper: BRAND.surface },
    text: { primary: BRAND.onSurface, secondary: BRAND.muted },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: ['Inter', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
    h1: { fontSize: '1.5rem', fontWeight: 750, lineHeight: 1.2, letterSpacing: -0.25 },
    h2: { fontSize: '0.85rem', fontWeight: 700, lineHeight: 1.25 },
    h4: { fontSize: '1.8rem', fontWeight: 750 },
    subtitle2: { fontSize: '0.82rem', fontWeight: 700 },
    body2: { fontSize: '0.76rem' },
    button: { textTransform: 'none', fontWeight: 600 },
    caption: { fontWeight: 500, fontSize: '0.68rem', lineHeight: 1.35 },
    overline: { fontSize: '0.64rem', fontWeight: 750, lineHeight: 1.5, letterSpacing: 0.7 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderColor: BRAND.border,
          borderRadius: DASHBOARD.cardRadius,
          boxShadow: '0 1px 2px rgba(15, 35, 55, 0.06), 0 3px 10px rgba(15, 35, 55, 0.025)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        // Ações em pílula, marca do design system de referência.
        root: { borderRadius: 7, minHeight: 30 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { height: 22, fontWeight: 650, fontSize: '0.66rem', borderRadius: 999 },
        icon: { fontSize: '0.9rem' },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { fontSize: '0.68rem', padding: '5px 8px', borderColor: '#E7EDF1' },
        head: {
          fontWeight: 700,
          color: BRAND.muted,
          whiteSpace: 'nowrap',
          fontSize: '0.58rem',
          textTransform: 'uppercase',
          letterSpacing: 0.25,
          paddingTop: 4,
          paddingBottom: 4,
        },
      },
    },
    MuiTextField: {
      defaultProps: { size: 'small' },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { minHeight: 32, fontSize: '0.7rem', borderRadius: 7 },
        input: { paddingTop: 7, paddingBottom: 7 },
      },
    },
    MuiInputLabel: {
      styleOverrides: { root: { fontSize: '0.72rem' } },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          minHeight: 30,
          paddingTop: 3,
          paddingBottom: 3,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: BRAND.surfaceAlt,
          borderRight: `1px solid ${BRAND.border}`,
          boxShadow: '12px 0 32px rgba(17, 24, 39, 0.025)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 9,
          '&.Mui-selected': {
            backgroundColor: alpha(BRAND.primary, 0.1),
            '&:hover': { backgroundColor: alpha(BRAND.primary, 0.16) },
          },
        },
      },
    },
  },
});
