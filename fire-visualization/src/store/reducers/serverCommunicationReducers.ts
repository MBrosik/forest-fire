import { combineReducers, createSlice, ThunkAction, UnknownAction } from '@reduxjs/toolkit';
import { Configuration, ConfigurationUpdate, getDefaultConfiguration } from '../../model/configuration/configuration';
import { FileSystemNode } from '../../model/FileSystemModel/FileSystemNode';
import { NodeTypeEnum } from '../../model/FileSystemModel/NodeTypeEnum';
import { Sensor } from '../../model/sensor';
import { Camera } from '../../model/camera';
import { FireBrigade } from '../../model/FireBrigade';
import { ForesterPatrol } from '../../model/ForesterPatrol';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { dispatch, RootState } from '../reduxStore';
import { updateConfiguration } from './mapConfigurationSlice';
import { AnyAction } from 'redux';

type serverCommunicationState = {
  // abortController: AbortController;
  isFetching: boolean;
};

let abortController = new AbortController();
const initialState: serverCommunicationState = {
  // abortController: new AbortController(),
  isFetching: false,
};

export const serverCommunicationSlice = createSlice({
  name: 'serverCommunication',
  initialState,
  reducers: {
    abortConnection(state) {
      // state.abortController.abort();
      // state.abortController = new AbortController();
      if(abortController.signal.aborted) {
        return;
      }
      abortController.abort();
      abortController = new AbortController();
      state.isFetching = false;
    },
    setIsFetching(state, action) {
      state.isFetching = action.payload.isFetching;
    }
  },
});




export const startFetchingConfigurationUpdate = (): ThunkAction<void, RootState, unknown, AnyAction> => {
  return (dispatch: any, getState: () => RootState) => {
    const state = getState();
    const {serverCommunication,  mapConfiguration} = state;
    if (serverCommunication.isFetching) {
      return;
    }

    console.log(mapConfiguration.configuration);

    const newConfiguration: Configuration = JSON.parse(JSON.stringify(mapConfiguration.configuration));

    newConfiguration.sectors.forEach((sector) => {
      sector.row-=1;
      sector.column-=1;
    });

    console.log(JSON.stringify(newConfiguration))

    // const newConfiguration = mapConfiguration.configuration;
    
    // serverCommunication.isFetching = true;
    dispatch(serverCommunicationSlice.actions.setIsFetching({isFetching: true}));

    fetchEventSource(`http://localhost:8181/run-simulation?interval=${5}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newConfiguration),
      // signal: serverCommunication.abortController.signal,
      signal: abortController.signal,

      onmessage: (event) => {
        const newState = JSON.parse(event.data) as ConfigurationUpdate;
        // newState.sectors.forEach((sector) => {
          
        //   sector.row+=1;
        //   sector.column+=1;
        // });
        console.log('Event received:', newState);
        if (abortController.signal.aborted) {
          console.log("Aborted")
          return;
        }
        dispatch(updateConfiguration({ configurationUpdate: newState })); // TODO use timestamp that is being sent
      },
      onerror: (event) => {
        console.error('Event error:', event);
      },
      onclose: () => {
        console.log('Event source closed'); // TODO probably ctrl.signal doesn't work
      },
    });

  }
}

export const {
  abortConnection
} = serverCommunicationSlice.actions;
export const { reducer: serverCommunicationReducer } = serverCommunicationSlice;
