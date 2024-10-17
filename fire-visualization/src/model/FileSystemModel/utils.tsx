import { FileSystemNode } from './FileSystemNode';
import { NodeTypeEnum } from './NodeTypeEnum';

export const getSampleFileSystem = (): FileSystemNode[] => {
  return [
    {
      id: '1',
      name: 'Folder1',
      nodeType: NodeTypeEnum.FOLDER,
      contents: [
        { id: '3', name: 'File1', nodeType: NodeTypeEnum.FILE } as FileSystemNode,
        { id: '4', name: 'File2', nodeType: NodeTypeEnum.FILE } as FileSystemNode,
        { id: '5', name: 'File3', nodeType: NodeTypeEnum.FILE } as FileSystemNode,
      ],
    } as FileSystemNode,
    {
      id: '2',
      name: 'Folder2',
      nodeType: NodeTypeEnum.FOLDER,
      contents: [
        { id: '6', name: 'File1', nodeType: NodeTypeEnum.FILE } as FileSystemNode,
        { id: '7', name: 'File2', nodeType: NodeTypeEnum.FILE } as FileSystemNode,
        { id: '8', name: 'File3', nodeType: NodeTypeEnum.FILE } as FileSystemNode,
      ],
    } as FileSystemNode,
    { id: '9', name: 'File1', nodeType: NodeTypeEnum.FILE } as FileSystemNode,
    { id: '10', name: 'File2', nodeType: NodeTypeEnum.FILE } as FileSystemNode,
  ];
};
