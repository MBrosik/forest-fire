import { FC, SetStateAction, Dispatch, useState, useEffect } from 'react';
import { FireBrigade } from '../../../model/FireBrigade';
import { ForesterPatrol, isForesterPatrol } from '../../../model/ForesterPatrol';
import { Camera, isCamera } from '../../../model/camera';
import { Sensor, isSensor } from '../../../model/sensor';
import { PlusOutlined } from '@ant-design/icons';
import { List, ListItem, Button } from '@mui/material';
import { SensorlikeListItem } from './SensorlikeListItem';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/reduxStore';

export type SensorlikeListParams = {
  sensorlikeItems: (Sensor | Camera | ForesterPatrol | FireBrigade)[];
  openModal: Dispatch<SetStateAction<boolean>>;
  url: string;
};

export const SensorlikeList: FC<SensorlikeListParams> = ({ sensorlikeItems, url, openModal }: SensorlikeListParams) => {
  const { configuration: mapConfiguration, currentSectorId } = useSelector(
    (state: RootState) => state.mapConfiguration,
  );
  const [idx, setIdx] = useState<number | undefined>(undefined);
  useEffect(() => {
    setIdx(currentSectorId !== null ? currentSectorId - 1 : undefined);
  }, [currentSectorId]);

  const getListKey = (item: Sensor | Camera | ForesterPatrol | FireBrigade): string => {
    if (isSensor(item)) {
      return `sensor-${item.sensorId}`;
    } else if (isCamera(item)) {
      return `camera-${item.cameraId}`;
    } else if (isForesterPatrol(item)) {
      return `foresterPatrol-${item.foresterPatrolId}`;
    } else {
      return `fireBrigade-${item.fireBrigadeId}`;
    }
  };

  const objectWithinSelectedSector = (object: Sensor | Camera | FireBrigade | ForesterPatrol) => {
    if (currentSectorId === null || idx === undefined) return false;

    const lon_min = mapConfiguration.sectors[idx].contours[0][0];
    const lon_max = mapConfiguration.sectors[idx].contours[2][0];
    const lat_min = mapConfiguration.sectors[idx].contours[0][1];
    const lat_max = mapConfiguration.sectors[idx].contours[2][1];

    if (isSensor(object) || isCamera(object)) {
      return (
        lon_min <= object.location.longitude &&
        object.location.longitude <= lon_max &&
        lat_min <= object.location.latitude &&
        object.location.latitude <= lat_max
      );
    } else {
      return (
        lon_min <= object.currentLocation.longitude &&
        object.currentLocation.longitude <= lon_max &&
        lat_min <= object.currentLocation.latitude &&
        object.currentLocation.latitude <= lat_max
      );
    }
  };

  return (
    <List>
      <ListItem
        sx={{
          p: '2px',
          borderRadius: '4px',
          transition: 'all 0.25s',
          '&:hover': {
            bgcolor: 'secondary.lighter',
          },
        }}
      >
        <Button
          sx={{
            display: 'inline-flex',
            flexGrow: 1,
            alignItems: 'center',
            justifyContent: 'center',
            height: 24,
            backgroundColor: 'transparent',
            '&:hover': {
              bgcolor: 'transparent',
            },
          }}
          type="button"
          color="secondary"
          onClick={() => openModal(true)}
        >
          <PlusOutlined />
        </Button>
      </ListItem>
      {sensorlikeItems
        .filter((item) => objectWithinSelectedSector(item))
        .map((item) => (
          <SensorlikeListItem
            key={getListKey(item)}
            values={item}
            url={url}
          />
        ))}
    </List>
  );
};
