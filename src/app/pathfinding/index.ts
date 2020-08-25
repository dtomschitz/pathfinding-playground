import { Algorithm, Algorithms } from '../models';
import { astar } from './algorithms';

export * from './grid';
export * from './mazes';

export const algorithms: Algorithm[] = [
  {
    id: 'astar',
    name: 'A* Serach',
    fn: astar,
  },
];

export function getAlgorithm(id: string) {
  return algorithms.find((algorithm) => algorithm.id === id);
}
