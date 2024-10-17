import { PolygonLayer } from '@deck.gl/layers';
import { Region } from '../../model/geography';
import { Configuration } from '../../model/configuration/configuration';
import { useMemo } from 'react';

export const useForestBorderLayer = ({ location }: Configuration) => {
  return useMemo(
    () =>
      new PolygonLayer<Region>({
        id: 'ForestBorder',
        data: [location],

        extruded: false,
        filled: false,
        stroked: true,
        getPolygon: (points) => points.map((point) => [point.longitude, point.latitude]),
        getLineColor: [0, 255, 0],
        getLineWidth: 30,
        lineWidthMinPixels: 1,
        pickable: false,
      }),
    [location],
  );
};
