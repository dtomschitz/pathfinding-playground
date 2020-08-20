
import { Grid } from '../components';
import { AlgorithmOptions } from '../models';
import { Heuristics } from './heuristic';

export function astar(grid: Grid, options?: AlgorithmOptions) {
  const heuristic = options.heuristic ?? Heuristics.manhatten;
  const weight = options.weight ?? 1;

  const startNode = grid.getNode(grid.start.row, grid.start.col);
  const targetNode = grid.getNode(grid.target.row, grid.target.col);

  startNode.g = 0;
  startNode.f = 0;
}
