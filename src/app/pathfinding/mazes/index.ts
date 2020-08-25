import { Maze } from '../../models';
import { randomMaze } from './random-maze';

export const mazes: Maze[] = [
  {
    id: 'randomMaze',
    name: 'Random Maze',
    generatorFn: randomMaze,
  },
];

export function getMaze(id: string) {
  return mazes.find((maze) => maze.id === id);
}
