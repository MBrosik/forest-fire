import { SensorMarker } from '../components/maps/SensorMarkers';
import { getDefaultMapLocation } from './common';
import { MapLocation } from './geography';

export const SensorTypes = [
  'TEMPERATURE_AND_AIR_HUMIDITY',
  'WIND_SPEED',
  'WIND_DIRECTION',
  'LITTER_MOISTURE',
  'PM2_5',
  'CO2',
];

export type SensorType = (typeof SensorTypes)[number];

export type Sensor = {
  sensorId: number;
  sensorType: SensorType;
  location: MapLocation;
  timestamp: number;
};

export const Sensor = {
  toMarkerProps: (sensor: Sensor): SensorMarker => {
    return {
      location: { lng: sensor.location.longitude, lat: sensor.location.latitude },
      key: `sensor-${sensor.sensorId}`,
      type: sensor.sensorType,
    };
  },
};

export const isSensor = (obj: unknown): obj is Sensor => {
  return (obj as Sensor).sensorId !== undefined;
};

export const getDefaultSensor = (): Sensor => {
  return {
    sensorId: 0,
    sensorType: 'CO2',
    location: getDefaultMapLocation(),
    timestamp: Date.now(),
  };
};
