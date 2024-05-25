import '@emotion/react';
import { Theme as MuiTheme } from '@mui/material/styles';

// Sobrescreva o tipo `Theme` do Emotion com o tipo do tema do Material UI
declare module '@emotion/react' {
  export interface Theme extends MuiTheme {}
}
