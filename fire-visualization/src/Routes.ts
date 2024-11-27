import { useRoutes } from 'react-router-dom';

// project import
import { MainRoutes } from './routes/MainRoutes';
import { SimulationRoutes } from './routes/SimulationRoutes';

// ==============================|| ROUTING RENDER ||============================== //

export const Routes = () => {
  return useRoutes([MainRoutes, SimulationRoutes]);
};
