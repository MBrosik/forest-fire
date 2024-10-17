import { useRef, useEffect, memo } from 'react';

// maps
import { useMap, AdvancedMarker } from '@vis.gl/react-google-maps';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import type { Marker } from '@googlemaps/markerclusterer';

import { Sensor, SensorType } from '../../model/sensor';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/reduxStore';

export type SensorMarker = {
  location: google.maps.LatLngLiteral;
  key: string;
  type: SensorType;
};

export const SensorMarkers = memo(() => {
  const map = useMap('main-map');

  // This has to be ref, not state because
  // state causes to the app to crash due to too many rerenders
  const markers = useRef<{ [key: string]: Marker }>({});

  const clusterer = useRef<MarkerClusterer | null>(null);

  const sensors = useSelector((state: RootState) => state.mapConfiguration.configuration.sensors);

  // Initialize MarkerClusterer
  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  // Update markers
  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers.current));
  }, [markers]);

  const setMarkerRef = (marker: Marker | null, key: string) => {
    if (marker && markers.current[key]) return;
    if (!marker && !markers.current[key]) return;

    if (marker) {
      markers.current[key] = marker;
    } else {
      delete markers.current[key];
    }
  };

  return (
    <>
      {sensors.map((sensor) => {
        const { location, key, type } = Sensor.toMarkerProps(sensor);
        return (
          <AdvancedMarker
            position={location}
            key={key}
            ref={(marker: Marker | null) => setMarkerRef(marker, key)}
          >
            <span className="sensor-marker">{sensorTypeToEmoji(type)}</span>
          </AdvancedMarker>
        );
      })}
    </>
  );
});
SensorMarkers.displayName = 'SensorMarkers';

const sensorTypeToEmoji = (sensorType: SensorType) => {
  switch (sensorType) {
    case 'TEMPERATURE_AND_AIR_HUMIDITY':
      return '🌡️';
    case 'WIND_SPEED':
      return '🌪';
    case 'WIND_DIRECTION':
      return '🧭';
    case 'LITTER_MOISTURE':
      return '🌿';
    case 'PM2_5':
      return '🫁';
    case 'CO2':
      return '💨';
    default:
      return '❌';
  }
};
