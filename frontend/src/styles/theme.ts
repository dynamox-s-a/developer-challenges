import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    components: {
        MuiCardActions: {
            variants: [
                {
                    props: { variant: 'align-right' },
                    style: {
                        display: "flex",
                        justifyContent: "flex-end"
                },
                }
            ]
        },
    },
});