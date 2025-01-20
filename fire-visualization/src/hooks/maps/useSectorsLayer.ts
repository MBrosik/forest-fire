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
  // console.log(sectors.map(sector => ({ ...sector, row: sector.row + 1, column: sector.column + 1 })))

  // const newSectors = sectors.map(sector => ({ ...sector, row: sector.row + 1, column: sector.column + 1 }))
  return useMemo(    
    () =>
      new PolygonLayer<Sector>({
        id: 'PolygonLayer',
        data: sectors,        

        extruded: false,
        filled: true,
        stroked: true,
        getPolygon: (sector) => sector.contours,
        getFillColor: (sector)=> {
          let fireLevel;
          if(sector.initialState.temperature <= 35){
            fireLevel = 1;
          }
          else if(sector.initialState.temperature <= 45){
            fireLevel = 2;
          }
          else if(sector.initialState.temperature <= 55){
            fireLevel = 3;          
          }          
          else {
            fireLevel = 4;          
          }

          let pm2_5Level;

          if(sector.initialState.pm2_5Concentration <= 50){
            pm2_5Level = 1;
          }
          else if(sector.initialState.pm2_5Concentration <= 100){
            pm2_5Level = 2;
          }
          else if(sector.initialState.pm2_5Concentration <= 250){
            pm2_5Level = 3;          
          }          
          else {
            pm2_5Level = 4;          
          }

          if(Math.max(fireLevel, pm2_5Level) === 1){
            return [0, 0, 0, 0]
          }   
          else if(Math.max(fireLevel, pm2_5Level) === 2){
            return [255, 200, 0, 100]
          }
          else if(Math.max(fireLevel, pm2_5Level) === 3){
            return [255, 140, 0, 100]
          }
          else if(Math.max(fireLevel, pm2_5Level) === 4){
            return [200, 0, 0, 100]
          }
          
          return [0, 0, 0, 0];
                 
        },
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
                .map((str, i) => {
                  return createElement(ListItem, { sx: { py: 0 }, key: i }, createElement(ListItemText, { primary: str }));
                }),
            ),
          );
          eventEmitter.emit('onTooltipChange', tooltip);
        },
        onClick: (pickingInfo: PickingInfo<Sector>) => {
          const { object: sector } = pickingInfo;
          if (onClickHandler && sector) {
            onClickHandler(sector.sectorId);
          }
          if (disableOnHover) return
          eventEmitter.emit('onSectorChange', sector?.sectorId ?? null);
        },
        autoHighlight: true,
        highlightColor: [116, 146, 195, 128],
      }),
    [sectors],
  );
};
