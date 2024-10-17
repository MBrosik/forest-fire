/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMemo } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Drawer, useMediaQuery } from '@mui/material';

// project import
import { DrawerContent } from './DrawerContent';
import { MiniDrawerStyled } from './MiniDrawerStyled';

// ==============================|| MAIN LAYOUT - DRAWER ||============================== //

type MainDrawerProps = {
  open: boolean;
  handleDrawerToggle: () => void;
  window?: any; // TODO
};

export const MainDrawer = ({ open, handleDrawerToggle, window }: MainDrawerProps) => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));

  // responsive drawer container
  const container = window !== undefined ? () => window().document.body : undefined;

  // header content
  const drawerContent = useMemo(() => <DrawerContent />, []);

  return (
    <Box
      component="nav"
      sx={{ flexShrink: { md: 0 }, zIndex: 1300 }}
      aria-label="mailbox folders"
    >
      {!matchDownMD ? (
        <MiniDrawerStyled
          variant="permanent"
          open={open}
        >
          {drawerContent}
        </MiniDrawerStyled>
      ) : (
        <Drawer
          container={container}
          variant="temporary"
          open={open}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', lg: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: 260,
              borderRight: `1px solid ${theme.palette.divider}`,
              backgroundImage: 'none',
              boxShadow: 'inherit',
            },
          }}
        >
          {open && drawerContent}
        </Drawer>
      )}
    </Box>
  );
};
