import { Box, Typography, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { FileAddOutlined, FolderAddOutlined, FolderOpenOutlined } from '@ant-design/icons';
import { FileSystemComponent } from './FileSystemComponent';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createNode, getNode, getNodeChildren, getNodes } from '../../../../components/apiService';
import {
  FileSystemNode,
  mapApiDataNodeToFileSystemNode,
  mapApiDataNodesToFileSystemNodes,
  mapFileSystemNodeToApiDataNode,
} from '../../../../model/FileSystemModel/FileSystemNode';
import { NodeTypeEnum } from '../../../../model/FileSystemModel/NodeTypeEnum';
import { Configuration } from '../../../../model/configuration/configuration';
import { SelectWorkspaceModal } from './SelectWorkspaceModal';
import { CreateFolderModal } from './CreateFolderModal';
import { CreateConfigurationModal } from './CreateConfigurationModal';
import { FormikProps } from 'formik';
import { useDispatch } from 'react-redux';
import {
  setConfiguration,
  setCurrentSectorId,
  setFileSystemNode,
} from '../../../../store/reducers/mapConfigurationSlice';

export type FileSystemNodes = { parent: FileSystemNode | null; nodes: FileSystemNode[] };

export const WorkspaceNavigation: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [isSelectWorkspaceModalVisible, setIsSelectWorkspaceModalVisible] = useState(false);
  const [workspace, setWorkspace] = useState<FileSystemNodes>({
    parent: null,
    nodes: [],
  });

  const [isNewFolderModalVisible, setIsNewFolderModalVisible] = useState(false);
  const [newFolderName, setNewFolderName] = useState<string | null>(null);

  const [isNewConfigurationModalVisible, setIsNewConfigurationModalVisible] = useState(false);
  const [newConfigurationName, setNewConfigurationName] = useState<string | null>(null);

  const [url] = useState('http://localhost:31415');

  const [allNodes, setAllNodes] = useState<FileSystemNodes>({ parent: null, nodes: [] });
  const [selectedMenuItem, setSelectedMenuItem] = useState<FileSystemNode | null>(null);
  const [selectedModalMenuItem, setSelectedModalMenuItem] = useState<FileSystemNode | null>(null);

  const configurationFormRef = useRef<FormikProps<Configuration> | null>(null);

  const handleSelectWorkspaceCloseModal = useCallback(() => {
    setIsSelectWorkspaceModalVisible(false);
    setSelectedMenuItem(null);
    setSelectedModalMenuItem(null);
  }, []);

  const fetchAllNodes = useCallback(async (): Promise<FileSystemNode[]> => {
    let convertedData: FileSystemNode[] = [];
    try {
      const data = await getNodes(url);
      convertedData = mapApiDataNodesToFileSystemNodes(data);
    } catch (error) {
      console.error('Error fetching nodes:', error);
    }

    return convertedData;
  }, [url]);

  const handleOpenSelectWorkspaceModal = useCallback(async () => {
    setIsSelectWorkspaceModalVisible(true);
    setSelectedMenuItem(null);
    setSelectedModalMenuItem(null);
    const fetchedNodes = await fetchAllNodes();
    setAllNodes((prevState) => ({ ...prevState, nodes: fetchedNodes }));
  }, [fetchAllNodes]);

  const fetchChildNodes = useCallback(async () => {
    try {
      if (workspace.parent) {
        const data = await getNodeChildren(url, workspace.parent.id);
        const convertedData = mapApiDataNodesToFileSystemNodes(data);
        setWorkspace((prevState) => ({ ...prevState, nodes: convertedData }));
      } else {
        setWorkspace((prevState) => ({ ...prevState, nodes: [] }));
      }
    } catch (error) {
      console.error('Error fetching nodes:', error);
    }
  }, [url, workspace.parent]);

  useEffect(() => {
    fetchChildNodes();
  }, [fetchChildNodes, workspace.parent]);

  const selectWorkspace = useCallback(async () => {
    try {
      if (selectedModalMenuItem) {
        const data = await getNode(url, selectedModalMenuItem.id);
        const convertedData = mapApiDataNodeToFileSystemNode(data);
        setWorkspace({ parent: convertedData, nodes: [] });
      }
    } catch (error) {
      console.error('Error fetching workspace node:', error);
    }

    handleSelectWorkspaceCloseModal();
  }, [handleSelectWorkspaceCloseModal, selectedModalMenuItem, url]);

  const handleOpenNewFolderModal = useCallback((): void => {
    setIsNewFolderModalVisible(true);
    setSelectedMenuItem(null);
    setSelectedModalMenuItem(null);
    setNewFolderName(null);
  }, []);

  const handleCloseNewFolderModal = useCallback((): void => {
    setIsNewFolderModalVisible(false);
    setSelectedMenuItem(null);
    setSelectedModalMenuItem(null);
    setNewFolderName(null);
  }, []);

  const handleOpenNewConfigurationModal = useCallback((): void => {
    setIsNewConfigurationModalVisible(true);
    setNewConfigurationName(null);
  }, []);

  const handleCloseNewConfigurationModal = useCallback((): void => {
    setIsNewConfigurationModalVisible(false);
    setNewConfigurationName(null);
  }, []);

  const handleCreateFolder = useCallback(async () => {
    if (selectedModalMenuItem && newFolderName) {
      const newFolder: FileSystemNode = {
        id: 'null',
        name: newFolderName,
        nodeType: NodeTypeEnum.FOLDER,
      };

      try {
        await createNode(url, mapFileSystemNodeToApiDataNode(newFolder, selectedModalMenuItem.id));
      } catch (error) {
        console.error('Error creating new folder:', error);
      }
    }

    fetchChildNodes();
    handleCloseNewFolderModal();
  }, [fetchChildNodes, handleCloseNewFolderModal, newFolderName, selectedModalMenuItem, url]);

  const handleCreateConfiguration = useCallback(async () => {
    if ((workspace.parent || selectedMenuItem) && newConfigurationName) {
      if (configurationFormRef.current) {
        await configurationFormRef.current.submitForm();
      }
    }
    fetchChildNodes();
    handleCloseNewConfigurationModal();
  }, [fetchChildNodes, handleCloseNewConfigurationModal, newConfigurationName, selectedMenuItem, workspace.parent]);

  const handleSubmit = async (values: Configuration) => {
    if (!newConfigurationName) return;
    if (!(workspace.parent || selectedMenuItem)) return;

    const sectors = Configuration.createSectors(values);
    const forestConfigurationWithSectors = { ...values, sectors };

    const newConfiguration: FileSystemNode = {
      id: 'null',
      name: newConfigurationName,
      nodeType: NodeTypeEnum.FILE,
    };
    const parentId = selectedMenuItem ? selectedMenuItem.id : workspace.parent?.id;
    if (!parentId) return;

    const newConfigurationMapped = mapFileSystemNodeToApiDataNode(newConfiguration, parentId);
    newConfigurationMapped.data = JSON.stringify(forestConfigurationWithSectors);

    try {
      await createNode(url, newConfigurationMapped);
    } catch (error) {
      console.error('Error creating new configuration:', error);
    }
  };

  return (
    <Box
      sx={{
        boxSizing: 'border-box',
        width: 250,
        paddingX: 1,
        borderRight: `1px solid ${theme.palette.divider}`,
        backgroundImage: 'none',
        boxShadow: 'inherit',
        bgcolor: 'secondary.A100',
      }}
    >
      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography
          sx={{
            color: 'secondary.main',
          }}
          variant="h6"
          component="div"
        >
          Workspace
        </Typography>
        <Box>
          <Button
            disabled={!workspace.parent || selectedMenuItem?.nodeType === NodeTypeEnum.FILE}
            sx={{ color: 'secondary.main', minWidth: 0 }}
            onClick={handleOpenNewConfigurationModal}
          >
            <FileAddOutlined style={{ fontSize: 20 }} />
          </Button>
          <Button
            sx={{ color: 'secondary.main', minWidth: 0 }}
            disabled={!workspace.parent}
            onClick={handleOpenNewFolderModal}
          >
            <FolderAddOutlined style={{ fontSize: 20 }} />
          </Button>
          <Button
            onClick={handleOpenSelectWorkspaceModal}
            sx={{ color: 'secondary.main', minWidth: 0 }}
          >
            <FolderOpenOutlined style={{ fontSize: 20 }} />
          </Button>
        </Box>
      </Box>

      <SelectWorkspaceModal
        isOpen={isSelectWorkspaceModalVisible}
        url={url}
        nodesData={allNodes}
        selectedNode={selectedModalMenuItem}
        setSelectedNode={setSelectedModalMenuItem}
        selectWorkspace={selectWorkspace}
        closeModal={handleSelectWorkspaceCloseModal}
      />

      <CreateFolderModal
        isOpen={isNewFolderModalVisible}
        url={url}
        newFolderName={newFolderName}
        setNewFolderName={setNewFolderName}
        nodesData={workspace}
        selectedNode={selectedModalMenuItem}
        setSelectedNode={setSelectedModalMenuItem}
        handleCreateFolder={handleCreateFolder}
        closeModal={handleCloseNewFolderModal}
      />

      <CreateConfigurationModal
        isOpen={isNewConfigurationModalVisible}
        url={url}
        newConfigurationName={newConfigurationName}
        setNewConfigurationName={setNewConfigurationName}
        nodesData={workspace}
        selectedNode={selectedModalMenuItem}
        configurationFormRef={configurationFormRef}
        handleCreateConfiguration={handleCreateConfiguration}
        handleSubmit={handleSubmit}
        closeModal={handleCloseNewConfigurationModal}
      />

      <FileSystemComponent
        data={workspace}
        selected={selectedMenuItem}
        onItemSelected={setSelectedMenuItem}
        inSelectWorkspace={false}
        onFileDoubleClick={async () => {
          // TODO firstly we should check
          // if there are any unsaved changes in the currently open configuration
          if (!selectedMenuItem) return;

          const node = await getNode(url, selectedMenuItem.id);
          if (node.data === null) return;

          const selectedConfiguration = JSON.parse(node.data) as Configuration;

          dispatch(
            setConfiguration({
              configuration: selectedConfiguration,
            }),
          );
          dispatch(
            setFileSystemNode({
              fileSystemNode: selectedMenuItem,
            }),
          );
          dispatch(
            setCurrentSectorId({
              currentSectorId: null,
            }),
          );
        }}
      />
    </Box>
  );
};
