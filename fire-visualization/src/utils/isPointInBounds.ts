import { MapLocation } from '../model/geography';

export const isPointInBounds = (point: MapLocation, bounds: google.maps.LatLngBoundsLiteral): boolean => {
  return (
    bounds.east < point.longitude &&
    point.longitude < bounds.west &&
    bounds.south < point.latitude &&
    point.latitude < bounds.north
  );
};
