import { MainLayout } from '../layout/MainLayout';
import { MainPage } from '../pages/MainPage';

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
