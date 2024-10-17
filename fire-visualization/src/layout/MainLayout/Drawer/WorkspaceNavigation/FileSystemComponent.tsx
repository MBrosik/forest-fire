import { Box, Collapse, List, ListItemButton, ListItemIcon, ListItemText, useTheme } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useState } from 'react';
import { FileSystemNode } from '../../../../model/FileSystemModel/FileSystemNode';
import { NodeTypeEnum } from '../../../../model/FileSystemModel/NodeTypeEnum';

interface Props {
  data: { parent: FileSystemNode | null; nodes: FileSystemNode[] };
  selected: FileSystemNode | null;
  onItemSelected: (item: FileSystemNode) => void;
  inSelectWorkspace: boolean;
  onFileDoubleClick: () => Promise<void>;
}

export const FileSystemComponent: React.FC<Props> = ({
  data,
  selected,
  onItemSelected,
  inSelectWorkspace,
  onFileDoubleClick,
}: Props) => {
  const [openFolders, setOpenFolders] = useState<string[]>([]);
  const theme = useTheme();

  const handleItemClick = (item: FileSystemNode) => {
    if (item.nodeType === NodeTypeEnum.FOLDER) {
      const isOpen = openFolders.includes(item.id);
      setOpenFolders(isOpen ? openFolders.filter((f) => f !== item.id) : [...openFolders, item.id]);
      onItemSelected(item);
      return;
    }

    if (!inSelectWorkspace) {
      onItemSelected(item);
    }
  };

  const getRenderStructure = (): FileSystemNode[] => {
    if (data.parent) {
      data.parent.contents = data.nodes;
      return [data.parent];
    } else {
      return data.nodes;
    }
  };

  const renderFileOrFolder = (item: FileSystemNode, level: number) => {
    if (item.nodeType === NodeTypeEnum.FOLDER) {
      return (
        <Box key={item.name}>
          <ListItemButton
            onClick={() => handleItemClick(item)}
            selected={item.id === selected?.id}
            sx={{
              cursor: 'pointer',
              pl: 2 * level,
              ':hover': { bgcolor: 'secondary.lighter' },
              '&.Mui-selected': {
                bgcolor: 'primary.lighter',
                borderRight: `2px solid ${theme.palette.primary.main}`,
                '&:hover': {
                  bgcolor: 'primary.lighter',
                },
              },
            }}
          >
            <ListItemIcon>
              <FolderIcon />
            </ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItemButton>
          <Collapse
            in={openFolders.includes(item.id)}
            timeout="auto"
            unmountOnExit
          >
            <List
              component="div"
              disablePadding
            >
              {item.contents && item.contents?.map((childItem) => renderFileOrFolder(childItem, level + 1))}
            </List>
          </Collapse>
        </Box>
      );
    } else {
      return (
        <ListItemButton
          key={item.name}
          onClick={() => handleItemClick(item)}
          onDoubleClick={onFileDoubleClick}
          selected={item.id === selected?.id && !inSelectWorkspace}
          disabled={inSelectWorkspace}
          sx={{
            cursor: 'pointer',
            pl: 2 * level,
            ':hover': { bgcolor: 'secondary.lighter' },
            '&.Mui-selected': {
              bgcolor: 'primary.lighter',
              borderRight: `2px solid ${theme.palette.primary.main}`,
              '&:hover': {
                bgcolor: 'primary.lighter',
              },
            },
          }}
        >
          <ListItemIcon>
            <InsertDriveFileIcon />
          </ListItemIcon>
          <ListItemText primary={item.name} />
        </ListItemButton>
      );
    }
  };

  return <List>{getRenderStructure().map((element) => renderFileOrFolder(element, 0))}</List>;
};
