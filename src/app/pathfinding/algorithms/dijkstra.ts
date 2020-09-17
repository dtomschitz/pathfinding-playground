import { AlgorithmCallbacks, AlgorithmOptions } from 'src/app/models';
import { Grid } from '../grid';
import { astar } from './astar';

export function dijkstra(grid: Grid, callbacks: AlgorithmCallbacks, options?: AlgorithmOptions) {
  return astar(grid, callbacks, { ...options, ...{ heuristic: () => 0 } });
}
