import { Point } from './point';

export interface Node {
  id: string;
  row: number;
  column: number;
  distance: number;
  totalDistance: number;
  heuristicDistance: number;
  weight: number;
  previousNode: string;
  path: string[];
  direction: NodeDirection;
  type: NodeType;
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
