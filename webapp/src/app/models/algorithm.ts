import { Grid } from './grid';
import { Node } from './node';

export interface Algorithm {
  id: string;
  name: string;
  fn: (grid: Grid, startNode: Node, targetNode: Node, heuristic) => void;
}

export type Algorithms = 'astar' | 'bfs' | 'dfs';
