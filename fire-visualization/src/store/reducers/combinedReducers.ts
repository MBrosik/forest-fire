// third-party
import { combineReducers } from 'redux';

// project import
import menuReducer from './menuSlice';
import { mapConfigurationReducer } from './mapConfigurationSlice';
import { serverCommunicationReducer } from './serverCommunicationReducers';

// ==============================|| COMBINE REDUCERS ||============================== //

export const combinedReducers = combineReducers({ menu: menuReducer, mapConfiguration: mapConfigurationReducer, serverCommunication: serverCommunicationReducer });
