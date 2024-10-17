import { FC, useEffect, useState } from 'react';
import { Form, Formik } from 'formik';
import { SectorFormPart } from './SectorConfiguration';
import { Button, Divider, Stack } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState, dispatch } from '../../store/reduxStore';
import { MainCard } from '../MainCard';
import {
  addCamera,
  addFireBrigade,
  addForesterPatrol,
  addSensor,
  setConfiguration,
} from '../../store/reducers/mapConfigurationSlice';
import { updateNode } from '../apiService';
import { mapFileSystemNodeToApiDataNode } from '../../model/FileSystemModel/FileSystemNode';
import { CreateSensorModal } from './create_items_modals/CreateSensorModal';
import { Sensor, isSensor } from '../../model/sensor';
import { FireBrigade, isFireBrigade } from '../../model/FireBrigade';
import { ForesterPatrol, isForesterPatrol } from '../../model/ForesterPatrol';
import { Camera, isCamera } from '../../model/camera';
import { CreateCameraModal } from './create_items_modals/CreateCameraModal';
import { CreateFireBrigadeModal } from './create_items_modals/CreateFireBrigadeModal';
import { CreateForesterPatrolModal } from './create_items_modals/CreateForesterPatrolModal';
import { SensorlikeList } from './SensorlikeList/SensorlikeList';
import { Configuration } from '../../model/configuration/configuration';

export const ConfigurationForm: FC = () => {
  const {
    configuration: mapConfiguration,
    currentSectorId,
    fileSystemNode,
  } = useSelector((state: RootState) => state.mapConfiguration);
  const [editInitialState, setEditInitialState] = useState<boolean>(false);
  const url = 'http://localhost:31415';

  const [isCreateSensorModalOpen, setIsCreateSensorModalOpen] = useState<boolean>(false);
  const [isCreateCameraModalOpen, setIsCreateCameraModalOpen] = useState<boolean>(false);
  const [isCreateFireBrigadeModalOpen, setIsCreateFireBrigadeModalOpen] = useState<boolean>(false);
  const [isCreateForesterPatrolModalOpen, setIsCreateForesterPatrolModalOpen] = useState<boolean>(false);

  const [idx, setIdx] = useState<number | undefined>(undefined);
  useEffect(() => {
    setIdx(currentSectorId !== null ? currentSectorId - 1 : undefined);
  }, [currentSectorId]);

  const closeCreateSensorModal = () => {
    setIsCreateSensorModalOpen(false);
  };

  const closeCreateCameraModal = () => {
    setIsCreateCameraModalOpen(false);
  };

  const closeCreateFireBrigadeModal = () => {
    setIsCreateFireBrigadeModalOpen(false);
  };

  const closeCreateForesterPatrolModal = () => {
    setIsCreateForesterPatrolModalOpen(false);
  };

  const handleCreate = async (values: Sensor | Camera | FireBrigade | ForesterPatrol) => {
    if (currentSectorId === null || idx === undefined) return;

    if (isSensor(values)) {
      closeCreateSensorModal();

      // Assign new sensorId based on the current list of sensors
      if (mapConfiguration.sensors.length > 0) {
        values.sensorId = Math.max(...mapConfiguration.sensors.map((sensor) => sensor.sensorId)) + 1;
      } else {
        values.sensorId = 0;
      }

      // Update the configuration file/document with the new sensor
      const apiNode = mapFileSystemNodeToApiDataNode(fileSystemNode, null);
      apiNode.data = JSON.stringify({
        ...mapConfiguration,
        sensors: [...mapConfiguration.sensors, values],
      } satisfies Configuration);

      await updateNode(url, fileSystemNode.id, apiNode);

      // Add sensor to the mapConfiguration stored in the redux state
      dispatch(addSensor({ sensor: values }));
    } else if (isCamera(values)) {
      closeCreateCameraModal();

      // Assign new cameraId based on the current list of cameras
      if (mapConfiguration.cameras.length > 0) {
        values.cameraId = Math.max(...mapConfiguration.cameras.map((camera) => camera.cameraId)) + 1;
      } else {
        values.cameraId = 0;
      }

      // Update the configuration file/document with the new camera
      const apiNode = mapFileSystemNodeToApiDataNode(fileSystemNode, null);
      apiNode.data = JSON.stringify({
        ...mapConfiguration,
        cameras: [...mapConfiguration.cameras, values],
      } satisfies Configuration);

      await updateNode(url, fileSystemNode.id, apiNode);

      // Add camera to the mapConfiguration stored in the redux state
      dispatch(addCamera({ camera: values }));
    } else if (isFireBrigade(values)) {
      closeCreateFireBrigadeModal();

      // Assign new fireBrigadeId based on the current list of fire brigades
      if (mapConfiguration.fireBrigades.length > 0) {
        values.fireBrigadeId =
          Math.max(...mapConfiguration.fireBrigades.map((fireBrigade) => fireBrigade.fireBrigadeId)) + 1;
      } else {
        values.fireBrigadeId = 0;
      }

      // Update the configuration file/document with the new fire brigade
      const apiNode = mapFileSystemNodeToApiDataNode(fileSystemNode, null);
      apiNode.data = JSON.stringify({
        ...mapConfiguration,
        fireBrigades: [...mapConfiguration.fireBrigades, values],
      } satisfies Configuration);

      await updateNode(url, fileSystemNode.id, apiNode);

      // Add fire brigade to the mapConfiguration stored in the redux state
      dispatch(addFireBrigade({ fireBrigade: values }));
    } else if (isForesterPatrol(values)) {
      closeCreateForesterPatrolModal();

      // Assign new foresterPatrolId based on the current list of forester patrols
      if (mapConfiguration.foresterPatrols.length > 0) {
        values.foresterPatrolId =
          Math.max(...mapConfiguration.foresterPatrols.map((foresterPatrol) => foresterPatrol.foresterPatrolId)) + 1;
      } else {
        values.foresterPatrolId = 0;
      }

      // Update the configuration file/document with the new forester patrol
      const apiNode = mapFileSystemNodeToApiDataNode(fileSystemNode, null);
      apiNode.data = JSON.stringify({
        ...mapConfiguration,
        foresterPatrols: [...mapConfiguration.foresterPatrols, values],
      } satisfies Configuration);

      await updateNode(url, fileSystemNode.id, apiNode);

      // Add forester patrol to the mapConfiguration stored in the redux state
      dispatch(addForesterPatrol({ foresterPatrol: values }));
    }
  };

  if (currentSectorId === null || idx === undefined) return null;

  return (
    <MainCard sx={{ mt: 2 }}>
      <Formik
        initialValues={mapConfiguration}
        onSubmit={(values) => {
          const stringifiedConfiguration = JSON.stringify(values);
          const apiNode = mapFileSystemNodeToApiDataNode(fileSystemNode, null);
          apiNode.data = stringifiedConfiguration;

          updateNode(url, fileSystemNode.id, apiNode).then(() => {
            dispatch(
              setConfiguration({
                configuration: values,
              }),
            );
          });
        }}
        enableReinitialize={true}
      >
        <Form>
          <Stack spacing={2}>
            <Divider>Sector {currentSectorId}</Divider>
            <SectorFormPart
              readonly={!editInitialState}
              obj={mapConfiguration.sectors[idx]}
            />
            <Button
              sx={{ display: editInitialState ? 'none' : 'block' }}
              color="primary"
              variant="outlined"
              type="button"
              onClick={() => setEditInitialState(true)}
            >
              Edit
            </Button>
            <Button
              sx={{ display: editInitialState ? 'block' : 'none' }}
              color="primary"
              variant="contained"
              type="submit"
              onClick={() => setEditInitialState(false)}
            >
              Save
            </Button>
          </Stack>
        </Form>
      </Formik>
      <Divider>Sensors</Divider>
      <CreateSensorModal
        isOpen={isCreateSensorModalOpen}
        closeModal={closeCreateSensorModal}
        handleSubmit={handleCreate}
      />
      <SensorlikeList
        sensorlikeItems={mapConfiguration.sensors}
        url={url}
        openModal={setIsCreateSensorModalOpen}
      />
      <Divider>Cameras</Divider>
      <CreateCameraModal
        isOpen={isCreateCameraModalOpen}
        closeModal={closeCreateCameraModal}
        handleSubmit={handleCreate}
      />
      <SensorlikeList
        sensorlikeItems={mapConfiguration.cameras}
        url={url}
        openModal={setIsCreateCameraModalOpen}
      />
      <Divider>Fire Brigades</Divider>
      <CreateFireBrigadeModal
        isOpen={isCreateFireBrigadeModalOpen}
        closeModal={closeCreateFireBrigadeModal}
        handleSubmit={handleCreate}
      />
      <SensorlikeList
        sensorlikeItems={mapConfiguration.fireBrigades}
        url={url}
        openModal={setIsCreateFireBrigadeModalOpen}
      />
      <Divider>Forester Patrols</Divider>
      <CreateForesterPatrolModal
        isOpen={isCreateForesterPatrolModalOpen}
        closeModal={closeCreateForesterPatrolModal}
        handleSubmit={handleCreate}
      />
      <SensorlikeList
        sensorlikeItems={mapConfiguration.foresterPatrols}
        url={url}
        openModal={setIsCreateForesterPatrolModalOpen}
      />
    </MainCard>
  );
};
