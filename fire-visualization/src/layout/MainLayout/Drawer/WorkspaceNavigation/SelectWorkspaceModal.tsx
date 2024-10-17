import { Modal, Typography, Button, Box } from '@mui/material';
import { FileSystemComponent } from './FileSystemComponent';
import { FileSystemNode } from '../../../../model/FileSystemModel/FileSystemNode';

type SelectWorkspaceModalProps = {
  isOpen: boolean;

  url: string;

  nodesData: { parent: FileSystemNode | null; nodes: FileSystemNode[] };
  selectedNode: FileSystemNode | null;
  setSelectedNode: (item: FileSystemNode) => void;

  selectWorkspace: () => Promise<void>;

  closeModal: () => void;
};
  
export const SelectWorkspaceModal = ({
  isOpen,
  url,
  nodesData,
  selectedNode,
  setSelectedNode,
  selectWorkspace,
  closeModal,
}: SelectWorkspaceModalProps) => {
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
        <Typography variant="h2">Open Workspace</Typography>
        <Typography> URL: {url} </Typography>

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
          onClick={selectWorkspace}
          disabled={selectedNode === null}
        >
          Open
        </Button>
        <Button onClick={closeModal}>Cancel</Button>
      </Box>
    </Modal>
  );
};
