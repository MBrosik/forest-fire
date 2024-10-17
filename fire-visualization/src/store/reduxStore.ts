// third-party
import { configureStore } from '@reduxjs/toolkit';

// project import
import { combinedReducers } from './reducers/combinedReducers';

// ==============================|| REDUX TOOLKIT - MAIN STORE ||============================== //

export const reduxStore = configureStore({
  reducer: combinedReducers,
});

export type RootState = ReturnType<typeof reduxStore.getState>;
export type AppDispatch = typeof reduxStore.dispatch;

export const { dispatch } = reduxStore;
