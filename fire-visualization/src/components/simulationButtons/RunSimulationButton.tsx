import { Button } from '@mui/material';
import { useCallback, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/reduxStore';
import { ConfigurationUpdate, isDefaultConfiguration } from '../../model/configuration/configuration';
import { updateConfiguration } from '../../store/reducers/mapConfigurationSlice';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { useNavigate } from 'react-router-dom';
import { abortConnection, startFetchingConfigurationUpdate } from '../../store/reducers/serverCommunicationReducers';
import { UnknownAction } from '@reduxjs/toolkit';

export const RunSimulationButton = () => {
  const { configuration: mapConfiguration } = useSelector((state: RootState) => state.mapConfiguration);
  const dispatch: AppDispatch = useDispatch();

  const navigate = useNavigate();  

  const ctrl = useRef<AbortController>(new AbortController());

  const fetchConfigurationUpdate = useCallback(() => {
    console.log("Fetch configuration update")

    dispatch(startFetchingConfigurationUpdate())
    
    
  }, [dispatch, mapConfiguration]);

  const startSimulation = useCallback(() => {       
    navigate('/simulation');
    fetchConfigurationUpdate();

   

  }, []);


  console.log("AbortController")
  console.log(new AbortController());

  return (
    <Button
      variant="contained"
      onClick={() => {
        startSimulation();        
      }}
      sx={{ width: '150px' }}
      disabled={isDefaultConfiguration(mapConfiguration)}
    >
      Run simulation
    </Button>
  );
};



// export const RunSimulationButton1 = () => {
//   const { configuration: mapConfiguration } = useSelector((state: RootState) => state.mapConfiguration);
//   const dispatch = useDispatch();

//   const [isRunning, setIsRunning] = useState<boolean>(false);

//   const ctrl = useRef<AbortController>(new AbortController());

//   const fetchConfigurationUpdate = useCallback(() => {
//     fetchEventSource(`http://localhost:8181/run-simulation?interval=${5}`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(mapConfiguration),
//       signal: ctrl.current.signal,

//       onmessage: (event) => {        
//         const newState = JSON.parse(event.data) as ConfigurationUpdate;
//         console.log('Event received:', newState);
//         if(ctrl.current.signal.aborted) {
//           console.log("Aborted")
//           return;
//         }
//         dispatch(updateConfiguration({ configurationUpdate: newState })); // TODO use timestamp that is being sent
//       },
//       onerror: (event) => {
//         console.error('Event error:', event);
//         setIsRunning(false);
//       },
//       onclose: () => {
//         console.log('Event source closed'); // TODO probably ctrl.signal doesn't work
//       },
//     });
//   }, [dispatch, mapConfiguration]);

  

//   return !isRunning ? (
//     <Button
//       variant="contained"
//       onClick={() => {
//         fetchConfigurationUpdate();
//         setIsRunning(true);
//       }}
//       sx={{ width: '150px' }}
//       disabled={isDefaultConfiguration(mapConfiguration)}
//     >
//       Run simulation
//     </Button>
//   ) : (
//     <Button
//       variant="contained"
//       color="error"
//       onClick={() => {
//         ctrl.current.abort();
//         setIsRunning(false);
//       }}
//       sx={{ width: '150px' }}
//     >
//       Stop simulation
//     </Button>
//   );
// };
