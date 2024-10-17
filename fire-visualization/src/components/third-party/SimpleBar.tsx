// material-ui
import { alpha, styled } from '@mui/material/styles';
import { Box } from '@mui/material';

// third-party
import SimpleBar from 'simplebar-react';
import { BrowserView, MobileView } from 'react-device-detect';
import { ReactNode } from 'react';

// root style
const RootStyle = ({ children }: { children: ReactNode }) => (
  <BrowserView
    style={{
      flexGrow: 1,
      height: '100%',
      overflow: 'hidden',
    }}
  >
    {children}
  </BrowserView>
);

// scroll bar wrapper
const SimpleBarStyle = styled(SimpleBar)(({ theme }) => ({
  maxHeight: '100%',
  '& .simplebar-scrollbar': {
    '&:before': {
      backgroundColor: alpha(theme.palette.grey[500], 0.48),
    },
    '&.simplebar-visible:before': {
      opacity: 1,
    },
  },
  '& .simplebar-track.simplebar-vertical': {
    width: 10,
  },
  '& .simplebar-track.simplebar-horizontal .simplebar-scrollbar': {
    height: 6,
  },
  '& .simplebar-mask': {
    zIndex: 'inherit',
  },
}));

// ==============================|| SIMPLE SCROLL BAR  ||============================== //

type SimpleBarScrollProps = {
  children: ReactNode;
  sx: object;
};

export const SimpleBarScroll = ({ children, sx, ...other }: SimpleBarScrollProps) => {
  return (
    <>
      <RootStyle>
        <SimpleBarStyle
          // timeout={500}
          clickOnTrack={false}
          sx={sx}
          {...other}
        >
          {children}
        </SimpleBarStyle>
      </RootStyle>
      <MobileView>
        <Box
          sx={{ overflowX: 'auto', ...sx }}
          {...other}
        >
          {children}
        </Box>
      </MobileView>
    </>
  );
};
