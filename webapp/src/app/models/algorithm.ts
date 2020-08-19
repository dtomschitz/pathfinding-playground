import { Node, NodeDirection } from './node';
import { Coordinates } from './coordinates';
import { Grid } from './grid';

export interface Algorithm {
  id: string;
  name: string;
  fn: (grid: Grid, startNode: Node, targetNode: Node, middleNode: Node) => void;
}

export type Algorithms = 'astar' | 'bfs' | 'dfs' | 'bidirectional';

export type Distance = [number, string[], NodeDirection];

export type Neighbors = Coordinates[];
