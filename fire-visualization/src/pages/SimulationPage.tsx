// material-ui
import { Grid } from '@mui/material';

// maps
import { MapWrapper } from '../components/maps/MapWrapper';
import { MainMap } from '../components/maps/MainMap';

export const SimulationPage = () => {
  return (
    <Grid
      container
      rowSpacing={4.5}
      columnSpacing={2.75}
    >
      <MapWrapper>
        <MainMap />
      </MapWrapper>
      
    </Grid>
  );
};
