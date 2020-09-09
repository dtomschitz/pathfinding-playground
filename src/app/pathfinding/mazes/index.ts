import { Maze } from '../../models';
import { randomMaze } from './random-maze';

export const mazes: Maze[] = [
  {
    id: 'noMaze',
    name: 'No Maze',
    generate: () => {},
  },
  {
    id: 'randomMaze',
    name: 'Random Maze',
    generate: randomMaze,
  },
];

export function getMaze(id: string) {
  return mazes.find((maze) => maze.id === id);
}
