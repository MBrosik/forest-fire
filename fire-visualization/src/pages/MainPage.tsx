// material-ui
import { Grid } from '@mui/material';

// maps
import { MapWrapper } from '../components/maps/MapWrapper';
import { MainMap } from '../components/maps/maps/MainMap';

// configuration
import { ConfigurationForm } from '../components/configuration/ConfigurationForm';

export const MainPage = () => {
  return (
    <Grid
      container
      rowSpacing={4.5}
      columnSpacing={2.75}
    >
      <MapWrapper>
        <MainMap />
      </MapWrapper>
      <Grid
        item
        xs={12}
      >
        <ConfigurationForm />
      </Grid>
    </Grid>
  );
};
