import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
    interface Palette {
        black: string;
        dark: string;
        light1: string;
        light2: string;
        white: string;
    }
    interface PaletteOptions {
        black?: string;
        dark?: string;
        light1?: string;
        light2?: string;
        white?: string;
    }
}

const theme = createTheme({
    palette: {
        black: '#000',
        dark: '#252525',
        light1: '#DFE3E8',
        light2: '#eeeeee',
        primary: { main: '#71008d' },
        white: '#fff',
    },
});

export default theme;
