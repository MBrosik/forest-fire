import { FC, ReactNode } from 'react';
import { Sensor, isSensor } from '../../../model/sensor';
import { FireBrigade } from '../../../model/FireBrigade';
import { ForesterPatrol, isForesterPatrol } from '../../../model/ForesterPatrol';
import { Camera, isCamera } from '../../../model/camera';
import { Box, Button, ListItem, Typography } from '@mui/material';
import { CloseCircleOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState, dispatch } from '../../../store/reduxStore';
import { mapFileSystemNodeToApiDataNode } from '../../../model/FileSystemModel/FileSystemNode';
import { updateNode } from '../../apiService';
import { setConfiguration } from '../../../store/reducers/mapConfigurationSlice';

type SensorlikeListItemProps = {
  values: Sensor | Camera | ForesterPatrol | FireBrigade;
  url: string;
};

export const SensorlikeListItem: FC<SensorlikeListItemProps> = ({ values, url }: SensorlikeListItemProps) => {
  const { configuration: mapConfiguration, fileSystemNode } = useSelector((state: RootState) => state.mapConfiguration);

  const deleteItem = () => {
    const newConfiguration = { ...mapConfiguration };
    if (isSensor(values)) {
      newConfiguration.sensors = newConfiguration.sensors.filter((sensor) => sensor.sensorId !== values.sensorId);
    } else if (isCamera(values)) {
      newConfiguration.cameras = newConfiguration.cameras.filter((camera) => camera.cameraId !== values.cameraId);
    } else if (isForesterPatrol(values)) {
      newConfiguration.foresterPatrols = newConfiguration.foresterPatrols.filter(
        (foresterPatrol) => foresterPatrol.foresterPatrolId !== values.foresterPatrolId,
      );
    } else {
      newConfiguration.fireBrigades = newConfiguration.fireBrigades.filter(
        (fireBrigade) => fireBrigade.fireBrigadeId !== values.fireBrigadeId,
      );
    }

    const stringifiedConfiguration = JSON.stringify(newConfiguration);
    const apiNode = mapFileSystemNodeToApiDataNode(fileSystemNode, null);
    apiNode.data = stringifiedConfiguration;

    updateNode(url, fileSystemNode.id, apiNode).then(() => {
      dispatch(
        setConfiguration({
          configuration: newConfiguration,
        }),
      );
    });
  };

  const renderItem = (): ReactNode => {
    if (isSensor(values)) {
      return (
        <>
          <Typography sx={{ width: 50 }}>ID: {values.sensorId}</Typography>
          <Typography>Type: {values.sensorType}</Typography>
        </>
      );
    } else if (isCamera(values)) {
      return (
        <>
          <Typography sx={{ width: 50 }}>ID: {values.cameraId}</Typography>
          <Typography>Range: {values.range}</Typography>
        </>
      );
    } else if (isForesterPatrol(values)) {
      return (
        <>
          <Typography sx={{ width: 50 }}>ID: {values.foresterPatrolId}</Typography>
          <Typography>State: {values.state}</Typography>
        </>
      );
    } else {
      // if (isFireBrigade(values))
      return (
        <>
          <Typography sx={{ width: 50 }}>ID: {values.fireBrigadeId}</Typography>
          <Typography>State: {values.state}</Typography>
        </>
      );
    }
  };

  return (
    <ListItem
      sx={{
        height: 1,
        cursor: 'pointer',
        display: 'inline-flex',
        justifyContent: 'space-between',
        p: '2px',
        borderRadius: '4px',
        transition: 'all 0.25s',
        '&:hover': {
          bgcolor: 'secondary.lighter',
        },
      }}
    >
      <Box
        sx={{
          display: 'inline-flex',
          flexGrow: 1,
          alignItems: 'center',
          justifyContent: 'flex-start',
          alignSelf: 'flex-start',
          height: 24,
        }}
      >
        {renderItem()}
      </Box>

      <Button
        sx={{
          height: 24,
          width: 24,
          alignSelf: 'center',
          p: 0,
          minWidth: 0,
          bgcolor: 'secondary.A100',
        }}
        variant="outlined"
        color="error"
        onClick={deleteItem}
      >
        <CloseCircleOutlined />
      </Button>
    </ListItem>
  );
};
