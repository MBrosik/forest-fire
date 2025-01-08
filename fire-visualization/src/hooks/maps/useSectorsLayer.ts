import { createElement, CSSProperties, useMemo } from 'react';
import { Configuration } from '../../model/configuration/configuration';
import { PolygonLayer } from '@deck.gl/layers';
import { Sector } from '../../model/sector';
import { PickingInfo } from '@deck.gl/core';
import { eventEmitter } from '../../utils/eventEmitter';
import { Box, List, ListItem, ListItemText } from '@mui/material';

const styles = {
  tooltip: {
    display: 'block',
    zIndex: 1,
    position: 'absolute',
    backgroundColor: 'rgba(66, 66, 66, 0.6)',
    color: 'white',
    padding: '5px',
    borderRadius: '5px',
  } as const,
} satisfies Record<string, CSSProperties>;

export const useSectorsLayer = ({ sectors }: Configuration, disableOnHover?: boolean, onClickHandler?: (sectorId: number) => void) => {
  return useMemo(
    () =>
      new PolygonLayer<Sector>({
        id: 'PolygonLayer',
        data: sectors,

        extruded: false,
        filled: true,
        stroked: true,
        getPolygon: (sector) => sector.contours,
        getFillColor: [0, 0, 0, 0],
        getLineColor: [255, 0, 0],
        getLineWidth: 20,
        lineWidthMinPixels: 1,
        pickable: true,
        onHover: (pickingInfo: PickingInfo<Sector>) => {
          if (disableOnHover) return
          const { x, y, object: sector, viewport } = pickingInfo;
          if (!sector) {
            eventEmitter.emit('onTooltipChange', null);
            return;
          }

          // check the currently shown tooltip
          // if the sector is the same do not update the tooltip
          const oldTooltip = document.getElementById('tooltip-sector');
          if (oldTooltip && oldTooltip.className === `sector-${sector.sectorId}`) return;

          const sectorCenterCoords = {
            longitude:
              sector.contours.reduce((avgLng: number, point: [number, number]) => avgLng + point[0], 0) /
              sector.contours.length,
            latitude:
              sector.contours.reduce((avgLat: number, point: [number, number]) => avgLat + point[1], 0) /
              sector.contours.length,
          };
          const sectorCenterPixels = viewport?.project([sectorCenterCoords.longitude, sectorCenterCoords.latitude]);

          const tooltip = createElement(
            Box,
            {
              id: `tooltip-sector`,
              className: `sector-${sector.sectorId}`,
              sx: {
                ...styles.tooltip,
                left: Math.round(sectorCenterPixels?.[0] ?? x) + 'px',
                top: Math.round(sectorCenterPixels?.[1] ?? y) + 'px',
              },
            },
            createElement(
              List,
              { dense: false },
              Configuration.sectors
                .toString(sector)
                .split('\n')
                .map((str) => {
                  return createElement(ListItem, { sx: { py: 0 } }, createElement(ListItemText, { primary: str }));
                }),
            ),
          );
          eventEmitter.emit('onTooltipChange', tooltip);
        },
        onClick: (pickingInfo: PickingInfo<Sector>) => {
          const { object: sector } = pickingInfo;
          if(onClickHandler && sector) {
            onClickHandler(sector.sectorId);
          }
          if(disableOnHover) return
          eventEmitter.emit('onSectorChange', sector?.sectorId ?? null);
        },
        autoHighlight: true,
        highlightColor: [116, 146, 195, 128],
      }),
    [sectors],
  );
};
