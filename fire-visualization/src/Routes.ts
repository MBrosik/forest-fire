import { useRoutes } from 'react-router-dom';

// project import
import { MainRoutes } from './routes/MainRoutes';

// ==============================|| ROUTING RENDER ||============================== //

export const Routes = () => {
  return useRoutes([MainRoutes]);
};
