import { alpha, createTheme } from '@mui/material/styles';

// Identidade visual: cor principal #692746 (RGB 105, 39, 70), um vinho/bordô.
// Todas as cores do app saem daqui: para mudar a identidade, mude só este arquivo.
const brand = {
  main: '#692746',
  light: '#87526B', // 20% mais clara
  dark: '#4A1B31', // 30% mais escura
  accent: '#A83E6F', // mesmo tom, mais vivo
};

export const theme = createTheme({
  palette: {
    primary: {
      main: brand.main,
      light: brand.light,
      dark: brand.dark,
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: brand.accent,
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FAF7F8', // fundo das páginas
      paper: '#FFFFFF', // fundo dos cards, menus e tabelas
    },
    action: {
      // Item selecionado e "hover" ganham um fundo bem suave na cor da marca
      selected: alpha(brand.main, 0.08),
      hover: alpha(brand.main, 0.04),
    },
  },
  shape: { borderRadius: 8 },
});