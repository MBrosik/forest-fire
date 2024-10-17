import { createSlice } from '@reduxjs/toolkit';
import { Configuration, ConfigurationUpdate, getDefaultConfiguration } from '../../model/configuration/configuration';
import { FileSystemNode } from '../../model/FileSystemModel/FileSystemNode';
import { NodeTypeEnum } from '../../model/FileSystemModel/NodeTypeEnum';
import { Sensor } from '../../model/sensor';
import { Camera } from '../../model/camera';
import { FireBrigade } from '../../model/FireBrigade';
import { ForesterPatrol } from '../../model/ForesterPatrol';

type mapConfigurationState = {
  fileSystemNode: FileSystemNode;
  configuration: Configuration;
  currentSectorId: number | null;
};

const initialState: mapConfigurationState = {
  fileSystemNode: {
    id: '',
    name: '',
    nodeType: NodeTypeEnum.FILE,
  },
  configuration: getDefaultConfiguration(),
  currentSectorId: null,
};

export const mapConfigurationSlice = createSlice({
  name: 'mapConfiguration',
  initialState,
  reducers: {
    setConfiguration: (state, action) => {
      const { configuration } = action.payload;
      const processedSectors = Configuration.preprocessSectors(configuration);
      state.configuration = { ...configuration, sectors: processedSectors };
    },
    updateConfiguration: (state, action: { payload: { configurationUpdate: ConfigurationUpdate }; type: string }) => {
      const { configurationUpdate } = action.payload;
      state.configuration = Configuration.updateConfiguration(state.configuration, configurationUpdate);
    },
    setCurrentSectorId: (state, action) => {
      const { currentSectorId: prevSectorId } = state;
      const { currentSectorId: nextSectorId } = action.payload;
      state.currentSectorId = prevSectorId !== nextSectorId ? nextSectorId : null;
    },
    setFileSystemNode: (state, action) => {
      const { fileSystemNode } = action.payload;
      state.fileSystemNode = fileSystemNode;
    },
    addSensor: (state, action: { payload: { sensor: Sensor }; type: string }) => {
      const { sensor } = action.payload;
      state.configuration.sensors.push(sensor);
    },
    addCamera: (state, action: { payload: { camera: Camera }; type: string }) => {
      const { camera } = action.payload;
      state.configuration.cameras.push(camera);
    },
    addFireBrigade: (state, action: { payload: { fireBrigade: FireBrigade }; type: string }) => {
      const { fireBrigade } = action.payload;
      state.configuration.fireBrigades.push(fireBrigade);
    },
    addForesterPatrol: (state, action: { payload: { foresterPatrol: ForesterPatrol }; type: string }) => {
      const { foresterPatrol } = action.payload;
      state.configuration.foresterPatrols.push(foresterPatrol);
    },
  },
});

export const {
  setConfiguration,
  updateConfiguration,
  setCurrentSectorId,
  setFileSystemNode,
  addSensor,
  addCamera,
  addFireBrigade,
  addForesterPatrol,
} = mapConfigurationSlice.actions;
export const { reducer: mapConfigurationReducer } = mapConfigurationSlice;
