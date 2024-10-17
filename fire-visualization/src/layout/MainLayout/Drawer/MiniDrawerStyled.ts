// material-ui
import { styled } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';

// ==============================|| DRAWER - MINI STYLED ||============================== //

export const MiniDrawerStyled = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })<{ open?: boolean }>(({
  theme,
  open,
}) => {
  const openedMixin = {
    width: 260,
    borderRight: `1px solid ${theme.palette.divider}`,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
    boxShadow: 'none',
  };

  const closedMixin = {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: 0,
    borderRight: 'none',
    boxShadow: theme.shadows[1],
  };

  return {
    // width: 260,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [],
    ...(open
      ? {
          ...openedMixin,
          '& .MuiDrawer-paper': openedMixin,
        }
      : {
          ...closedMixin,
          '& .MuiDrawer-paper': closedMixin,
        }),
  };
});
