// material-ui
import { Palette } from '@mui/material/styles';
import { Color, PaletteMode } from '@mui/material';

// third-party
import { PalettesProps, presetPalettes } from '@ant-design/colors';

// ==============================|| DEFAULT THEME - PALETTE  ||============================== //

const makePaletteColors = (
  colors: PalettesProps,
): Pick<Palette, 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'grey'> => {
  const { blue, red, gold, cyan, green, grey } = colors;
  const greyColors: Color = {
    0: grey[0],
    50: grey[1],
    100: grey[2],
    200: grey[3],
    300: grey[4],
    400: grey[5],
    500: grey[6],
    600: grey[7],
    700: grey[8],
    800: grey[9],
    900: grey[10],
    A50: grey[15],
    A100: grey[11],
    A200: grey[12],
    A400: grey[13],
    A700: grey[14],
    A800: grey[16],
  };
  const contrastText = '#fff';

  return {
    primary: {
      lighter: blue[0],
      100: blue[1],
      200: blue[2],
      light: blue[3],
      400: blue[4],
      main: blue[5],
      dark: blue[6],
      700: blue[7],
      darker: blue[8],
      900: blue[9],
      contrastText,
    },
    secondary: {
      lighter: greyColors[100],
      100: greyColors[100],
      200: greyColors[200],
      light: greyColors[300],
      400: greyColors[400],
      main: greyColors[500],
      600: greyColors[600],
      dark: greyColors[700],
      800: greyColors[800],
      darker: greyColors[900],
      A100: greyColors[0],
      A200: greyColors.A400,
      A300: greyColors.A700,
      contrastText: greyColors[0] ?? contrastText,
    },
    error: {
      lighter: red[0],
      light: red[2],
      main: red[4],
      dark: red[7],
      darker: red[9],
      contrastText,
    },
    warning: {
      lighter: gold[0],
      light: gold[3],
      main: gold[5],
      dark: gold[7],
      darker: gold[9],
      contrastText: greyColors[100],
    },
    info: {
      lighter: cyan[0],
      light: cyan[3],
      main: cyan[5],
      dark: cyan[7],
      darker: cyan[9],
      contrastText,
    },
    success: {
      lighter: green[0],
      light: green[3],
      main: green[5],
      dark: green[7],
      darker: green[9],
      contrastText,
    },
    grey: greyColors,
  };
};

export const makePalette = (mode: PaletteMode) => {
  const colors = presetPalettes;

  const greyPrimary = [
    '#ffffff',
    '#fafafa',
    '#f5f5f5',
    '#f0f0f0',
    '#d9d9d9',
    '#bfbfbf',
    '#8c8c8c',
    '#595959',
    '#262626',
    '#141414',
    '#000000',
  ];
  const greyAscent = ['#fafafa', '#bfbfbf', '#434343', '#1f1f1f'];
  const greyConstant = ['#fafafb', '#e6ebf1'];

  colors.grey = [...greyPrimary, ...greyAscent, ...greyConstant];

  const paletteColors = makePaletteColors(colors);

  return {
    mode,
    common: {
      black: '#000',
      white: '#fff',
    },
    ...paletteColors,
    text: {
      primary: paletteColors?.grey?.[700],
      secondary: paletteColors?.grey?.[500],
      disabled: paletteColors?.grey?.[400],
    },
    action: {
      disabled: paletteColors?.grey?.[300],
    },
    divider: paletteColors?.grey?.[200],
    background: {
      paper: paletteColors?.grey?.[0],
      default: paletteColors?.grey?.A50,
    },
  };
};
