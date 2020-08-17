import { Algorithm, Maze, Mazes } from '../models';
import { generateRandomMaze } from './random-maze';

export const mazes: Maze[] = [
  {
    id: 'randomMaze',
    name: 'Random Maze',
    generatorFn: generateRandomMaze,
  },
];

export function getMaze(id: Mazes) {
  return mazes.find((maze) => maze.id === id);
}
