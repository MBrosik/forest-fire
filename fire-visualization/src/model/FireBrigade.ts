import { FireBrigadeMarker } from '../components/maps/FireBrigadeMarkers';
import { getDefaultMapLocation } from './common';
import { MapLocation } from './geography';

export const FireBrigadeStates = ['AVAILABLE', 'TRAVELLING', 'EXTINGUISHING'] as const;

export type FireBrigadeState = (typeof FireBrigadeStates)[number];

export type FireBrigade = {
  fireBrigadeId: number;
  timestamp: number;
  state: FireBrigadeState;
  baseLocation: MapLocation;
  currentLocation: MapLocation;
};

// TODO adjust this type
export type FireBrigadeUpdate = {
  fireBrigadeId: number;
  action: FireBrigadeState;
  state: FireBrigadeState;
  location: MapLocation;
  sectorId: number;
};

export const FireBrigade = {
  toMarkerProps: (fireBrigade: FireBrigade): FireBrigadeMarker => {
    return {
      location: { lng: fireBrigade.currentLocation.longitude, lat: fireBrigade.currentLocation.latitude },
      key: `fireBrigade-${fireBrigade.fireBrigadeId}`,
      state: fireBrigade.state,
    };
  },
  updateFireBrigade: (fireBrigade: FireBrigade, update: FireBrigadeUpdate): FireBrigade => {
    return {
      ...fireBrigade,
      state: update.state, // TODO or maybe action?
      currentLocation: update.location,
    };
  },
};

export const isFireBrigade = (obj: unknown): obj is FireBrigade => {
  return (obj as FireBrigade).fireBrigadeId !== undefined;
};

export const getDefaultFireBrigade = (): FireBrigade => {
  return {
    fireBrigadeId: 0,
    timestamp: Date.now(),
    state: 'AVAILABLE',
    baseLocation: getDefaultMapLocation(),
    currentLocation: getDefaultMapLocation(),
  };
};
