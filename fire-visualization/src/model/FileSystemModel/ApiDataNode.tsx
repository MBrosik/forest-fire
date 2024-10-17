import { NodeTypeEnum } from './NodeTypeEnum';

export interface ApiDataNode {
  id: string | null;
  name: string;
  nodeType: NodeTypeEnum;
  parentId: string | null;
  data: string | null;
  createdAt: string;
  updatedAt: string;
}
