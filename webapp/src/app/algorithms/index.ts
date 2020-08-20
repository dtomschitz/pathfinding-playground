import { Algorithm, Algorithms } from '../models';

export const algorithms: Algorithm[] = [
  {
    id: 'astar',
    name: 'A* Serach',
    fn: () => {},
  },
  {
    id: 'bidirectional',
    name: 'Bidirectional',
    fn: () => {},
  },
  {
    id: 'bfs',
    name: 'Breadth-first Search',
    fn: () => {},
  },
  {
    id: 'dfs',
    name: 'Depth-first Search',
    fn: () => {},
  },
];

export function getAlgorithm(id: Algorithms) {
  return algorithms.find((algorithm) => algorithm.id === id);
}
