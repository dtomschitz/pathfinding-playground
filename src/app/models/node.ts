export interface Node {
  id: string;
  x: number;
  y: number;
  type: NodeType;
  status?: 'opened' | 'closed';
  isPath?: boolean;
  g?: number;
  f?: number;
  h?: number;
  s?: 'opened' | 'closed';
  parent?: Node;
}

export interface NodeCoordinates {
  x: number;
  y: number;
}

export interface NodeDroppedEvent {
  previousNode: Node;
  newNode: Node;
}

export enum NodeType {
  DEFAULT = 'default',
  WALL = 'wall',
  START = 'start',
  TARGET = 'target',
}

export type Nodes = { [key: string]: Node };

export type NodeDirection = 'up' | 'up-left' | 'up-right' | 'down' | 'down-left' | 'down-right' | 'left' | 'right';
