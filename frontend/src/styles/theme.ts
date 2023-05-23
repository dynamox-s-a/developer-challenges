import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        common: {
            black: "#090a0b",
            white: "#f0f3f5"
        },
        primary: {
            main: "#263252",
            light: "#5c6d89",
            dark: "#101a2b",
            contrastText: "#f0f3f5"
        },
        secondary:{
            main: "#607d8b",
            light: "#8eacbf",
            dark: "#34515f",
            contrastText: "#f0f3f5"
        },
        error: {
            main: "#e53935",
            light: "#ff6f60",
            dark: "#ab000d",
            contrastText: "#f0f3f5"
        },
        warning: {
            main: "#ffc107",
            light: "#ffd54f",
            dark: "#c79100",
            contrastText: "#090a0b"
        },
        info: {
            main: "#039be5",
            light: "#63ccff",
            dark: "#006db3",
            contrastText: "#f0f3f5"
        },
        success: {
            main: "#4caf50",
            light: "#81c784",
            dark: "#087f23",
            contrastText: "#f0f3f5"
        },
        background: {
            paper: "#e6e9ea",
            default: "#f0f3f5"
        }
    },
    components: {
        MuiCardActions: {
            variants: [
                {
                    props: { variant: "align-right" },
                    style: {
                        display: "flex",
                        justifyContent: "flex-end"
                },
                }
            ]
        },
    },
});