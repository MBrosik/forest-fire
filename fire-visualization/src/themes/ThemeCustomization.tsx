import { ReactNode, useMemo } from 'react';

// material-ui
import { CssBaseline, StyledEngineProvider, ThemeOptions } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// project import
import { makePalette } from './makePalette';
import { makeTypography } from './makeTypography';
import { makeCustomShadows } from './makeCustomShadows';
import { componentsOverrides } from './componentsOverrides';

// ==============================|| DEFAULT THEME - MAIN  ||============================== //

type ThemeCustomizationProps = {
  children: ReactNode;
};

export const ThemeCustomization = ({ children }: ThemeCustomizationProps) => {
  const themePalette = makePalette('light');
  const themeTypography = makeTypography(`'Public Sans', sans-serif`);

  const themeOptions: ThemeOptions = useMemo(
    () => ({
      breakpoints: {
        values: {
          xs: 0,
          sm: 768,
          md: 1024,
          lg: 1266,
          xl: 1536,
        },
      },
      direction: 'ltr',
      mixins: {
        toolbar: {
          minHeight: 60,
          paddingTop: 8,
          paddingBottom: 8,
        },
      },
      palette: themePalette,
      typography: themeTypography,
    }),
    [themePalette, themeTypography],
  );

  const theme = createTheme(themeOptions);
  theme.components = componentsOverrides(theme);
  theme.customShadows = makeCustomShadows(theme);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
};
