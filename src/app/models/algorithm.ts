import { NodeDirection } from './node';
import { Grid } from '../pathfinding';

export interface Algorithm {
  id: string;
  name: string;
  fn: (grid: Grid, options?: AlgorithmOptions) => number[][];
}

export interface AlgorithmOptions {
  weight?: number;
  heuristic?: (dx: number, dy: number) => number;
}

export type Algorithms = 'astar' | 'bfs' | 'dfs' | 'bidirectional';

export type Distance = [number, string[], NodeDirection];
