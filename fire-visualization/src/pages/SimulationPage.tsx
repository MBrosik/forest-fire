// material-ui
import { Grid } from '@mui/material';

// maps
import { MapWrapper } from '../components/maps/MapWrapper';
import { MainMap } from '../components/maps/maps/MainMap';
import DetailsContainer from '../components/simulationPanel/DetailsContainer';
import FireInformationContainer from '../components/simulationPanel/FireInformationContainer';
import RecommendedDecisions from '../components/simulationPanel/RecomendedDecisions';
import FireBrigadeManagement from '../components/simulationPanel/FireBrigade/FireBrigadeManagement';

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
      <Grid
        item
        xs={12}
      >
        <DetailsContainer />
        <FireInformationContainer />
        <RecommendedDecisions />
        <FireBrigadeManagement />
      </Grid>
    </Grid>
  );
};
