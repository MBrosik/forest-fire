import { useMemo } from 'react';
import { PolygonLayer } from '@deck.gl/layers';
import { ProcessedSector } from '../../model/processedSector';

export const useSelectedSectorLayer = (sector: ProcessedSector | undefined) => {
  return useMemo(() => {
    if (!sector) return null;
    return new PolygonLayer<ProcessedSector>({
      id: 'SelectedSector',
      data: [sector],

      extruded: false,
      filled: false,
      stroked: true,
      getPolygon: (sector) => sector.contours,
      getLineColor: [0, 0, 255],
      getLineWidth: 30,
      lineWidthMinPixels: 4,
      pickable: false,
    });
  }, [sector]);
};
