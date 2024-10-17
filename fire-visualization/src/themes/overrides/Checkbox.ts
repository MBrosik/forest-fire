import { Theme } from '@mui/material';

// ==============================|| OVERRIDES - CHECKBOX ||============================== //

export const Checkbox = (theme: Theme) => {
  return {
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: theme.palette.secondary.main,
        },
      },
    },
  };
};
