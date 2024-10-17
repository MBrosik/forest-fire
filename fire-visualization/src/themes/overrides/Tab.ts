import { Theme } from '@mui/material';

// ==============================|| OVERRIDES - TAB ||============================== //

export const Tab = (theme: Theme) => {
  return {
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 46,
          color: theme.palette.text.primary,
        },
      },
    },
  };
};
