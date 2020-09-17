import { Algorithm } from '../../models';
import { astar } from './astar';
import { breadthFirst } from './breadth-first';
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
  {
    id: 'breadthFirst',
    name: 'Breadth First',
    fn: breadthFirst,
  },
];

export function getAlgorithm(id: string) {
  return algorithms.find((algorithm) => algorithm.id === id);
}
