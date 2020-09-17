import { Grid } from '../pathfinding';
import { NodeDirection, Node } from './node';

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
  opened: (node: Node) => void;
  closed: (node: Node) => void;
}

export type AlgorithmOperation = Pick<Node, 'x' | 'y' | 'status'>;

export type Algorithms = { [key: string]: Algorithm };

export type Distance = [number, string[], NodeDirection];
