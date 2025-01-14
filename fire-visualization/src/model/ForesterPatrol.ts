import { ForesterPatrolBaseMarker } from '../components/maps/ForesterPatrolBaseMarkers';
import { ForesterPatrolMarker } from '../components/maps/ForesterPatrolMarkers';
import { getDefaultMapLocation } from './common';
import { MapLocation } from './geography';

export const ForesterPatrolStates = ['AVAILABLE', 'TRAVELLING', 'PATROLLING', 'FORRESTING'] as const;

export type ForesterPatrolState = (typeof ForesterPatrolStates)[number];

export type ForesterPatrol = {
  foresterPatrolId: number;
  timestamp: number;
  state: ForesterPatrolState;
  baseLocation: MapLocation;
  currentLocation: MapLocation;
};

// TODO adjust this type
export type ForesterPatrolUpdate = {
  foresterPatrolId: number;
  timestamp: string; // TODO change to number
  state: ForesterPatrolState;
  baseLocation: MapLocation;
  currentLocation: MapLocation;
};

export const ForesterPatrol = {
  toMarkerProps: (foresterPatrol: ForesterPatrol): ForesterPatrolMarker => {
    return {
      location: { lng: foresterPatrol.currentLocation.longitude, lat: foresterPatrol.currentLocation.latitude },
      key: `foresterPatrol-${foresterPatrol.foresterPatrolId}`,
      state: foresterPatrol.state,
    };
  },
  updateForesterPatrol: (
    foresterPatrol: ForesterPatrol,
    foresterPatrolUpdate: ForesterPatrolUpdate,
  ): ForesterPatrol => {
    return {
      ...foresterPatrol,
      state: foresterPatrolUpdate.state,
      currentLocation: foresterPatrolUpdate.currentLocation,
      // TODO update rest of the fields
    };
  },
};

export const ForesterPatrolBase = {
  toMarkerProps: (foresterPatrol: ForesterPatrol): ForesterPatrolBaseMarker => {
    return {
      location: { lng: foresterPatrol.baseLocation.longitude, lat: foresterPatrol.baseLocation.latitude },
      key: `foresterPatrolBase-${foresterPatrol.foresterPatrolId}`,      
    };
  },
}

export const isForesterPatrol = (obj: unknown): obj is ForesterPatrol => {
  return (obj as ForesterPatrol).foresterPatrolId !== undefined;
};

export const getDefaultForesterPatrol = (): ForesterPatrol => {
  return {
    foresterPatrolId: 0,
    timestamp: Date.now(),
    state: 'AVAILABLE',
    baseLocation: getDefaultMapLocation(),
    currentLocation: getDefaultMapLocation(),
  };
};
