// types
import { createSlice } from '@reduxjs/toolkit';

export type MenuState = {
  openItem: string[];
  defaultId: string;
  openComponent: string;
  drawerOpen: boolean;
  componentDrawerOpen: boolean;
};

// initial state
const initialState: MenuState = {
  openItem: ['dashboard'],
  defaultId: 'dashboard',
  openComponent: 'buttons',
  drawerOpen: false,
  componentDrawerOpen: true,
};

// ==============================|| SLICE - MENU ||============================== //

export const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    openDrawer(state, action) {
      state.drawerOpen = action.payload.drawerOpen;
    },

    openComponentDrawer(state, action) {
      state.componentDrawerOpen = action.payload.componentDrawerOpen;
    },
  },
});

export const { openDrawer, openComponentDrawer } = menuSlice.actions;
export default menuSlice.reducer;
