import { NodeDirection, Node } from './node';
import { Grid } from '../pathfinding';

export interface Algorithm {
  id: string;
  name: string;
  fn: (grid: Grid, callbacks: AlgorithmCallbacks, options?: AlgorithmOptions) => number[][];
}

export interface AlgorithmOptions {
  weight?: number;
  heuristic?: (dx: number, dy: number) => number;
}

export interface AlgorithmCallbacks {
  opened: (node: Node, iteration: number) => void;
  closed: (node: Node, iteration: number) => void;
}

export type AlgorithmOperation = Pick<Node, 'x' | 'y' | 'status'>;

export type Algorithms = { [key: string]: Algorithm };

export type Distance = [number, string[], NodeDirection];
