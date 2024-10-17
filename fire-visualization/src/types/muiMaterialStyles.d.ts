export * from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface CustomShadows {
    button?: string;
    text?: string;
    z1?: string;
  }
  interface Theme {
    customShadows?: CustomShadows;
  }

  interface PaletteColor {
    lighter?: string;
    100?: string;
    200?: string;
    // light: string;
    400?: string;
    // main: string;
    600?: string;
    // dark: string;
    700?: string;
    800?: string;
    darker?: string;
    900?: string;
    A100?: string;
    A200?: string;
    A300?: string;
    // contrastText: string
  }

  interface SimplePaletteColorOptions {
    lighter?: string;
    100?: string;
    200?: string;
    // light: string;
    400?: string;
    // main: string;
    600?: string;
    // dark: string;
    700?: string;
    800?: string;
    darker?: string;
    900?: string;
    A100?: string;
    A200?: string;
    A300?: string;
    // contrastText: string
  }
}
