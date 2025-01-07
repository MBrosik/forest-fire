import { Button } from '@mui/material';
import { useCallback, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/reduxStore';
import { ConfigurationUpdate, isDefaultConfiguration } from '../../model/configuration/configuration';
import { updateConfiguration } from '../../store/reducers/mapConfigurationSlice';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { useNavigate } from 'react-router-dom';

export const StopSimulationButton = () => {
  const { configuration: mapConfiguration } = useSelector((state: RootState) => state.mapConfiguration);
  const navigate = useNavigate();  

  const startSimulation = useCallback(() => {       
    // console.log("Simulation stopped");
    navigate('/');
  }, []);



  return (
    <Button
      variant="contained"
      color='error'
      onClick={() => {
        startSimulation();        
      }}
      sx={{ width: '150px' }}      
    >
      Stop simulation
    </Button>
  );
};
