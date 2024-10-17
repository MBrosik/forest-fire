import { APIProvider } from '@vis.gl/react-google-maps';
import { ReactNode } from 'react';

type MapWrapperProps = {
  children: ReactNode;
};

export const MapWrapper = ({ children }: MapWrapperProps) => {
  return <APIProvider apiKey={window.env.GOOGLE_API_KEY}>{children}</APIProvider>;
};
