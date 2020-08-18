import { Algorithm } from '../models';
import { astar } from './astar';

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
