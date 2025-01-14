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
      if (abortController.signal.aborted) {
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
    const { serverCommunication, mapConfiguration } = state;
    if (serverCommunication.isFetching) {
      return;
    }

    console.log(mapConfiguration.configuration);

    const newConfiguration: Configuration = JSON.parse(JSON.stringify(mapConfiguration.configuration));

    newConfiguration.sectors.forEach((sector) => {
      sector.row -= 1;
      sector.column -= 1;
    });

    console.log(JSON.stringify(newConfiguration))

    // const newConfiguration = mapConfiguration.configuration;

    // serverCommunication.isFetching = true;
    dispatch(serverCommunicationSlice.actions.setIsFetching({ isFetching: true }));

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
        dispatch(updateConfiguration({ configurationUpdate: newState }));
      },
      onerror: (event) => {
        console.error('Event error:', event);
      },
      onclose: () => {
        console.log('Event source closed');
      },
    });

  }
}

export const sendBrigadeOrForesterMoveOrder = (unitId: number, targetSectorId: number, type: "brigade"|"forester"): ThunkAction<void, RootState, unknown, AnyAction> => {
  return async (dispatch: any, getState: () => RootState) => {
    const state = getState();
    const { mapConfiguration } = state;

    const targetSector = mapConfiguration.configuration.sectors.find((sector) => sector.sectorId === targetSectorId);

    if (!targetSector) {
      console.error("Target sector not found");
      return;
    }

    const url = type == "brigade" ? "http://localhost:8181/orderFireBrigade" : "http://localhost:8181/orderForesterPatrol";

    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        [type == "brigade"?"fireBrigadeId": "forestPatrolId"]: unitId,
        goingToBase: false,
        location: {
          longitude: (targetSector.contours[0][0] + targetSector.contours[1][0]) / 2,
          latitude: (targetSector.contours[0][1] + targetSector.contours[1][1]) / 2
        }
      }),
    })
  }
}

export const sendBrigadeOrForesterMoveToBaseOrder = (brigadeID: number, type: "brigade"|"forester"): ThunkAction<void, RootState, unknown, AnyAction> => {
  return async (dispatch: any, getState: () => RootState) => {
    const state = getState();
    const { mapConfiguration } = state;


    let unit:ForesterPatrol|FireBrigade | undefined;

    if(type == "brigade") {
      unit =  mapConfiguration.configuration.fireBrigades.find((fireBrigade) => fireBrigade.fireBrigadeId === brigadeID);
    } else {
      unit =  mapConfiguration.configuration.foresterPatrols.find((foresterPatrol) => foresterPatrol.foresterPatrolId === brigadeID);
    }

    if (!unit) {
      console.error("Brigade not found");
      return;
    }

    const url = type == "brigade" ? "http://localhost:8181/orderFireBrigade" : "http://localhost:8181/orderForesterPatrol";

    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        [type == "brigade"?"fireBrigadeId": "forestPatrolId"]: brigadeID,
        goingToBase: true,
        location: {
          longitude: unit.baseLocation.longitude,
          latitude: unit.baseLocation.latitude
        }
      }),
    })
  }
}

export const {
  abortConnection
} = serverCommunicationSlice.actions;
export const { reducer: serverCommunicationReducer } = serverCommunicationSlice;
