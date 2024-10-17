import { useRef, useEffect } from 'react';

// maps
import { useMap, AdvancedMarker } from '@vis.gl/react-google-maps';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import type { Marker } from '@googlemaps/markerclusterer';

import { useSelector } from 'react-redux';
import { RootState } from '../../store/reduxStore';
import { ForesterPatrol, ForesterPatrolState } from '../../model/ForesterPatrol';

export type ForesterPatrolMarker = {
  location: google.maps.LatLngLiteral;
  key: string;
  state: ForesterPatrolState;
};

export const ForesterPatrolMarkers = () => {
  const map = useMap('main-map');

  // This has to be ref, not state because
  // state causes to the app to crash due to too many rerenders
  const markers = useRef<{ [key: string]: Marker }>({});

  const clusterer = useRef<MarkerClusterer | null>(null);

  const foresterPatrols = useSelector((state: RootState) => state.mapConfiguration.configuration.foresterPatrols);

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
      {foresterPatrols.map((foresterPatrol) => {
        const { location, key, state } = ForesterPatrol.toMarkerProps(foresterPatrol);
        return (
          <AdvancedMarker
            position={location}
            key={key}
            ref={(marker: Marker | null) => setMarkerRef(marker, key)}
          >
            <span className="forester-patrol-marker">{foresterPatrolStateToEmoji(state)}</span>
          </AdvancedMarker>
        );
      })}
    </>
  );
};

const foresterPatrolStateToEmoji = (foresterPatrolState: ForesterPatrolState) => {
  switch (foresterPatrolState) {
    case 'AVAILABLE':
      return '🏕';
    case 'TRAVELLING':
      return '🥾';
    case 'PATROLLING':
      return '🧗‍♂️';
    case 'FORRESTING':
      return '🏞';
    default:
      return '❌';
  }
};
