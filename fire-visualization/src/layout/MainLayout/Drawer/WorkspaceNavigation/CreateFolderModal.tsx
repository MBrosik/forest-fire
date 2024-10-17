import { Dispatch, SetStateAction } from 'react';
import { Modal, Typography, TextField, Button, Box } from '@mui/material';
import { FileSystemComponent } from './FileSystemComponent';
import { FileSystemNode } from '../../../../model/FileSystemModel/FileSystemNode';
import { FileSystemNodes } from './WorkspaceNavigation';

type CreateFolderModalProps = {
  isOpen: boolean;

  url: string;

  newFolderName: string | null;
  setNewFolderName: Dispatch<SetStateAction<string | null>>;

  nodesData: FileSystemNodes;
  selectedNode: FileSystemNode | null;
  setSelectedNode: (item: FileSystemNode) => void;

  handleCreateFolder: () => Promise<void>;

  closeModal: () => void;
};

export const CreateFolderModal = ({
  isOpen,
  url,
  newFolderName,
  nodesData,
  selectedNode,
  setSelectedNode,
  setNewFolderName,
  handleCreateFolder,
  closeModal,
}: CreateFolderModalProps) => {
  return (
    <Modal
      open={isOpen}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ backgroundColor: 'secondary.A100', p: 2, borderRadius: 2 }}>
        <Typography variant="h2">Create Folder</Typography>
        <Typography> URL: {url} </Typography>
        <TextField
          sx={{ my: 1 }}
          id="outlined-basic"
          label="Folder name"
          variant="outlined"
          onChange={(e) => setNewFolderName(e.target.value)}
        />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mt: 2,
            borderColor: 'secondary.darker',
            height: '480px',
            width: '640px',
            border: '1px solid',
            overflow: 'scroll',
          }}
        >
          <FileSystemComponent
            data={nodesData}
            selected={selectedNode}
            onItemSelected={setSelectedNode}
            inSelectWorkspace={true}
            onFileDoubleClick={async () => {}}
          />
        </Box>

        <Button
          onClick={handleCreateFolder}
          disabled={selectedNode === null || newFolderName === null || newFolderName === ''}
        >
          Create
        </Button>
        <Button onClick={closeModal}>Cancel</Button>
      </Box>
    </Modal>
  );
};
