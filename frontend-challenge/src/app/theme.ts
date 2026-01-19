import { createTheme } from '@mui/material/styles'
import { Manrope } from 'next/font/google'

const manrope = Manrope({
    subsets: ['latin'],
    weight: ['300', '400', '500', '700'],
    display: 'swap'
})

export const theme = createTheme({
    typography: {
        fontFamily: manrope.style.fontFamily,
        h1: {
            fontFamily: manrope.style.fontFamily,
        },
        h2: {
            fontFamily: manrope.style.fontFamily,
        },
        h3: {
            fontFamily: manrope.style.fontFamily,
        },
        h4: {
            fontFamily: manrope.style.fontFamily,
        },
        h5: {
            fontFamily: manrope.style.fontFamily,
        },
        h6: {
            fontFamily: manrope.style.fontFamily,
        },
        body1: {
            fontFamily: manrope.style.fontFamily,
        },
        body2: {
            fontFamily: manrope.style.fontFamily,
        },
        button: {
            fontFamily: manrope.style.fontFamily,
        },
    },
})
