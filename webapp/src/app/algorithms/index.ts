import { Algorithm, Algorithms } from '../models';
import { astar } from './astar';
import { unweightedSearch } from './unweighted-search';

export const algorithms: Algorithm[] = [
  {
    id: 'astar',
    name: 'A* Serach',
    fn: astar,
  },
  {
    id: 'bfs',
    name: 'Breadth-first Search',
    fn: (grid, startNode, targetNode) => unweightedSearch(grid, startNode, targetNode, 'bfs'),
  },
  {
    id: 'dfs',
    name: 'Depth-first Search',
    fn: (grid, startNode, targetNode) => unweightedSearch(grid, startNode, targetNode, 'dfs'),
  },
];

export function getAlgorithm(id: Algorithms) {
  return algorithms.find((algorithm) => algorithm.id === id);
}
