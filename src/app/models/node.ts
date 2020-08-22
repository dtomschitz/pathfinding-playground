export interface Node {
  id: string;
  x: number;
  y: number;
  type: NodeType;
  opened?: boolean;
  closed?: boolean;
  g?: number;
  f?: number;
  h?: number;
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
  VISITED = 'visited',
  PATH = 'path',
  START = 'start',
  TARGET = 'target',
}

export type NodeDirection = 'up' | 'up-left' | 'up-right' | 'down' | 'down-left' | 'down-right' | 'left' | 'right';