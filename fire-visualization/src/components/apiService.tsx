import { ApiDataNode } from '../model/FileSystemModel/ApiDataNode';
import { camelize } from '../utils/camelize';
import { snakeize } from '../utils/snakeize';

export const getNodes = async (baseUrl: string) => {
  const response = await fetch(baseUrl + '/api/v1/nodes/');
  const data = await response.json();

  return camelize(data.nodes) as ApiDataNode[];
};

export const getNode = async (baseUrl: string, id: string) => {
  const response = await fetch(baseUrl + `/api/v1/nodes/${id}`);
  const data = await response.json();

  return camelize(data) as ApiDataNode;
};

export const createNode = async (baseUrl: string, node: ApiDataNode) => {
  const data = snakeize(node);
  data.id = null;

  const response = await fetch(baseUrl + '/api/v1/nodes/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return response.json();
};

export const updateNode = async (baseUrl: string, id: string, node: ApiDataNode) => {
  const response = await fetch(baseUrl + `/api/v1/nodes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(snakeize(node)),
  });

  return response.json();
};

export const deleteNode = async (baseUrl: string, id: string) => {
  const response = await fetch(baseUrl + `/api/v1/nodes/${id}`, {
    method: 'DELETE',
  });

  return response.json();
};

export const getNodeChildren = async (baseUrl: string, id: string) => {
  const response = await fetch(baseUrl + `/api/v1/nodes/${id}/children`);
  const data = await response.json();

  return camelize(data.nodes) as ApiDataNode[];
};
