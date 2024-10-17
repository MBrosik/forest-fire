import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/reduxStore';

// Maps handling
import { limitTiltRange, Map } from '@vis.gl/react-google-maps';
import DeckGL from '@deck.gl/react';
import { MapViewState, WebMercatorViewport } from '@deck.gl/core';
import {
  DrawPointMode,
  EditableGeoJsonLayer,
  FeatureCollection,
  Position,
  ViewMode,
} from '@deck.gl-community/editable-layers';
import { useSelectedSectorLayer } from '../../hooks/maps/useSelectedSectorLayer';

// MUI components
import { MainCard } from '../MainCard';
import { Box, Button } from '@mui/material';

// Map types and default map location getter
import { MapLocation } from '../../model/geography';
import { getDefaultMapLocation } from '../../model/common';
import { Sector } from '../../model/sector';
import { isPointInBounds } from '../../utils/isPointInBounds';

const parsePositionToMapLocation = (position: Position): MapLocation => ({
  longitude: position[0],
  latitude: position[1],
});

type AddLocationMapProps = {
  handleSelectedLocation: (location: MapLocation) => void;
};

export const AddLocationMap = ({ handleSelectedLocation }: AddLocationMapProps) => {
  const { configuration: mapConfiguration, currentSectorId } = useSelector(
    (state: RootState) => state.mapConfiguration,
  );
  const [currentSector, setCurrentSector] = useState<Sector | undefined>(undefined);
  useEffect(() => {
    if (currentSectorId === null) {
      setCurrentSector(undefined);
      return;
    }
    setCurrentSector(mapConfiguration.sectors.find(({ sectorId }) => sectorId === currentSectorId));
  }, [mapConfiguration, currentSectorId]);

  const [initialViewState, setInitialViewState] = useState<MapViewState>({
    longitude: 18.85762440671972,
    latitude: 52.17435627305249,
    zoom: 5,
  });

  const [features, setFeatures] = useState<FeatureCollection>({
    type: 'FeatureCollection',
    features: [],
  });
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  const [isLocationDrawn, setIsLocationDrawn] = useState<boolean>(false);
  useEffect(() => {
    if (features.features.length === 1) {
      setIsLocationDrawn(true);
    } else {
      setIsLocationDrawn(false);
    }
  }, [features]);

  const drawLocationLayer = new EditableGeoJsonLayer({
    data: features,
    mode: isDrawing && !isLocationDrawn ? DrawPointMode : ViewMode,
    getLineColor: [194, 13, 0, 100],
    getFillColor: [194, 13, 0, 80],
    getLineWidth: 20,
    onEdit: ({ updatedData }) => {
      if (!currentSector) return;

      const featureCollection = updatedData as FeatureCollection;

      if (
        features.features.length === 0 &&
        featureCollection.features.length === 1 &&
        featureCollection.features[0].geometry.type === 'Point'
      ) {
        // Parse and save point coordinates as a location
        const locationCoords = featureCollection.features[0].geometry.coordinates;
        const location = parsePositionToMapLocation(locationCoords);

        if (isPointInBounds(location, Sector.getBoundsFromContours(currentSector))) {
          setFeatures(updatedData);
          handleSelectedLocation(location);
        }
      }
    },
    selectedFeatureIndexes: [], // IDK why this is necessary, but without this drawing fails
  });

  const toggleDrawing = () => {
    setIsDrawing((prev) => !prev);
  };

  const handleClearSelectedLocation = () => {
    setFeatures({
      type: 'FeatureCollection',
      features: [],
    });
    handleSelectedLocation(getDefaultMapLocation()); // TODO it will be better to make same required constraint or sth
    setIsDrawing(false);
  };

  const selectedSectorLayer = useSelectedSectorLayer(currentSector);

  return (
    <MainCard
      hasContent={false}
      sx={{ mt: 1.5 }}
    >
      <Box sx={{ position: 'relative', width: '100%', height: '500px' /* TODO fix fixed height */ }}>
        <DeckGL
          initialViewState={initialViewState}
          controller={true}
          layers={[selectedSectorLayer, drawLocationLayer]}
          onViewStateChange={limitTiltRange}
          onAfterRender={() => {
            if (!selectedSectorLayer || !selectedSectorLayer.isLoaded || !currentSector) return;

            const viewport = selectedSectorLayer.context.viewport as WebMercatorViewport;

            const currentSectorBounds = Sector.getBoundsFromContours(currentSector);
            const { longitude, latitude, zoom } = viewport.fitBounds(
              [
                [currentSectorBounds.west, currentSectorBounds.north],
                [currentSectorBounds.east, currentSectorBounds.south],
              ],
              { padding: 50 /* in px */ },
            );
            setInitialViewState({ longitude, latitude, zoom });
          }}
        >
          <Map />
        </DeckGL>
        <Box sx={{ position: 'absolute', top: 10, left: 10 }}>
          {!isLocationDrawn ? (
            !isDrawing ? (
              <Button
                variant="contained"
                color="primary"
                onClick={toggleDrawing}
              >
                Enable selecting location
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={toggleDrawing}
              >
                Disable selecting location
              </Button>
            )
          ) : (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleClearSelectedLocation}
              disabled={!isLocationDrawn}
            >
              Clear selected location
            </Button>
          )}
        </Box>
      </Box>
    </MainCard>
  );
};
