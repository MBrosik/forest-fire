export interface MapLocation {
  longitude: number;
  latitude: number;
}

export type Region = [MapLocation, MapLocation, MapLocation, MapLocation];

export const Directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const;

export type Direction = (typeof Directions)[number];
