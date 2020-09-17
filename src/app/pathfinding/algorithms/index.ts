import { Algorithm } from '../../models';
import { astar } from './astar';
import { dijkstra } from './dijkstra';

export const algorithms: Algorithm[] = [
  {
    id: 'astar',
    name: 'A*',
    fn: astar,
  },
  {
    id: 'dijkstra',
    name: 'Dijkstra',
    fn: dijkstra,
  },
];

export function getAlgorithm(id: string) {
  return algorithms.find((algorithm) => algorithm.id === id);
}
