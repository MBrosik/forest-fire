import { MainLayout } from '../layout/MainLayout';
import { MainPage } from '../pages/MainPage';
import { SimulationPage } from '../pages/SimulationPage';

// ==============================|| MAIN ROUTING ||============================== //

export const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <MainPage />,
    },
  ],
};
