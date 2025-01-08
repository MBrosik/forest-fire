// material-ui
import { useTheme } from '@mui/material/styles';
import { AppBar, IconButton, Toolbar, useMediaQuery } from '@mui/material';

// assets
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { StopSimulationButton } from '../../components/simulationButtons/StopSimulationButton';
import { AppBarStyled } from '../MainLayout/Header/AppBarStyled';

// ==============================|| MAIN LAYOUT - HEADER ||============================== //

export const Header = () => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));

  // common header
  const mainHeader = (
    <Toolbar sx={{ justifyContent: 'end' }}>    
      <StopSimulationButton />
    </Toolbar>
  );

  // app-bar params
  const appBar = {
    position: 'fixed',
    color: 'inherit',
    elevation: 0,
    sx: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      boxShadow: theme.shadows[1],
    },
  } as const;

  return (
    <>
      {!matchDownMD ? (
        <AppBarStyled          
          {...appBar}
        >
          {mainHeader}
        </AppBarStyled>
      ) : (
        <AppBar {...appBar}>{mainHeader}</AppBar>
      )}
    </>
  );
};
