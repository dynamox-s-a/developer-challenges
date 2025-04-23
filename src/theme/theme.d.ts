import '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Palette {
    neutral: Palette['primary']
  }
  interface PaletteOptions {
    neutral?: PaletteOptions['primary']
  }

  interface TypographyVariants {
    customTitle: React.CSSProperties
  }

  interface TypographyVariantsOptions {
    customTitle?: React.CSSProperties
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    customTitle: true
  }
}
