import { MainLayout } from '../layout/MainLayout';
import { SimulationLayout } from '../layout/SimulationLayout';
import { MainPage } from '../pages/MainPage';
import { SimulationPage } from '../pages/SimulationPage';

// ==============================|| MAIN ROUTING ||============================== //

export const SimulationRoutes = {
   path: '/',
   element: <SimulationLayout />,
   children: [
      {
         path: 'simulation',
         element: <SimulationPage />,
      }
   ],
};
