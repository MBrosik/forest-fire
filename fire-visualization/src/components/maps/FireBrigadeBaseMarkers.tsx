import { useRef, useEffect } from 'react';

// maps
import { useMap, AdvancedMarker } from '@vis.gl/react-google-maps';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import type { Marker } from '@googlemaps/markerclusterer';

import { useSelector } from 'react-redux';
import { RootState } from '../../store/reduxStore';
import { FireBrigade, FireBrigadeBase, FireBrigadeState } from '../../model/FireBrigade';

export type FireBrigadeBaseMarker = {
  location: google.maps.LatLngLiteral;
  key: string;
};

export const FireBrigadeBaseMarkers = () => {
  const map = useMap('main-map');

  // This has to be ref, not state because
  // state causes to the app to crash due to too many rerenders
  const markers = useRef<{ [key: string]: Marker }>({});

  const clusterer = useRef<MarkerClusterer | null>(null);

  const fireBrigades = useSelector((state: RootState) => state.mapConfiguration.configuration.fireBrigades);

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
      {fireBrigades.map((fireBrigade) => {
        const { location, key  } = FireBrigadeBase.toMarkerProps(fireBrigade);
         
        return (
          <AdvancedMarker
            position={location}
            key={key}
            ref={(marker: Marker | null) => setMarkerRef(marker, key)}
          >
            <span className="fire-brigade-marker">🏤</span>
          </AdvancedMarker>
        );
      })}
    </>
  );
};

