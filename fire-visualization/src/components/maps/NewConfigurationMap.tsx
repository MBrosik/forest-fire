import { useEffect, useState } from 'react';

// Maps handling
import { limitTiltRange, Map } from '@vis.gl/react-google-maps';
import DeckGL from '@deck.gl/react';
import { MapViewState } from '@deck.gl/core';
import {
  DrawRectangleMode,
  EditableGeoJsonLayer,
  FeatureCollection,
  Position,
  ViewMode,
} from '@deck.gl-community/editable-layers';

// MUI components
import { MainCard } from '../MainCard';
import { Box, Button } from '@mui/material';

// Form handling
import { useFormikContext } from 'formik';

// Map types and default configuration getter
import { Configuration, getDefaultConfiguration } from '../../model/configuration/configuration';
import { Region } from '../../model/geography';

// Initial state to display the whole Poland
const INITIAL_VIEW_STATE: MapViewState = {
  longitude: 18.85762440671972,
  latitude: 52.17435627305249,
  zoom: 5,
};

const parsePositionToMapLocation = (position: Position) => ({ longitude: position[0], latitude: position[1] });

export const NewConfigurationMap = () => {
  const { setFieldValue } = useFormikContext<Configuration>();

  const [features, setFeatures] = useState<FeatureCollection>({
    type: 'FeatureCollection',
    features: [],
  });
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  const [areForestBoundsDrawn, setAreForestBoundsDrawn] = useState<boolean>(false);
  useEffect(() => {
    if (features.features.length === 1) {
      setAreForestBoundsDrawn(true);
    } else {
      setAreForestBoundsDrawn(false);
    }
  }, [features]);

  const drawForestBoundsLayer = new EditableGeoJsonLayer({
    data: features,
    mode: isDrawing && !areForestBoundsDrawn ? DrawRectangleMode : ViewMode,
    getTentativeLineColor: [29, 82, 13, 100],
    getTentativeFillColor: [29, 82, 13, 80],
    getLineColor: [15, 43, 7, 100],
    getFillColor: [15, 43, 7, 80],
    onEdit: ({ updatedData }) => {
      const featureCollection = updatedData as FeatureCollection;

      if (
        features.features.length === 0 &&
        featureCollection.features.length === 1 &&
        featureCollection.features[0].geometry.type === 'Polygon'
      ) {
        setFeatures(updatedData);

        // Parse and save polygon coordinates as forest location
        const polygonCoords = featureCollection.features[0].geometry.coordinates[0].slice(0, 4);
        const forestBounds: Region = [
          parsePositionToMapLocation(polygonCoords[0]),
          parsePositionToMapLocation(polygonCoords[1]),
          parsePositionToMapLocation(polygonCoords[2]),
          parsePositionToMapLocation(polygonCoords[3]),
        ];

        setFieldValue('location', forestBounds);
      }
    },
    selectedFeatureIndexes: [], // IDK why this is necessary, but without this drawing fails
  });

  const toggleDrawing = () => {
    setIsDrawing((prev) => !prev);
  };

  const handleClearPolygon = () => {
    setFeatures({
      type: 'FeatureCollection',
      features: [],
    });
    setFieldValue('location', getDefaultConfiguration().location); // TODO it will be better to make same required constraint or sth
    setIsDrawing(false);
  };

  return (
    <MainCard
      hasContent={false}
      sx={{ mt: 1.5 }}
    >
      <Box sx={{ position: 'relative', width: '100%', height: '500px' /* TODO fix fixed height */ }}>
        <DeckGL
          initialViewState={INITIAL_VIEW_STATE}
          controller={true}
          layers={[drawForestBoundsLayer]}
          onViewStateChange={limitTiltRange}
        >
          <Map />
        </DeckGL>
        <Box sx={{ position: 'absolute', top: 10, left: 10 }}>
          {!areForestBoundsDrawn ? (
            !isDrawing ? (
              <Button
                variant="contained"
                color="primary"
                onClick={toggleDrawing}
              >
                Start Drawing
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={toggleDrawing}
              >
                Stop Drawing
              </Button>
            )
          ) : (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleClearPolygon}
              disabled={!areForestBoundsDrawn}
            >
              Clear Forest Bounds
            </Button>
          )}
        </Box>
      </Box>
    </MainCard>
  );
};
