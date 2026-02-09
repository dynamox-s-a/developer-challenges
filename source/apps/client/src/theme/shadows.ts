declare module '@mui/material/styles' {
  interface Theme {
    customShadows: string[];
  }
  interface ThemeOptions {
    customShadows?: string[];
  }
}

const customShadows = [
  '2px 2px 10px 0px rgba(10,10,10,0.2)', '0px 18px 40px 0px #7090B01F',
  '2px 2px 10px 0px rgba(10,10,10,0.2)', '0px 12px 20px 0px #7090B01F',
];

export default customShadows;
