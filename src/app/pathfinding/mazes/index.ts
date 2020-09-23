import { Maze } from '../../models';
import { randomMaze } from './random-maze';
import { recursiveDivisionMaze } from './recursive-division-maze';

export const mazes: Maze[] = [
  {
    id: 'noMaze',
    name: 'No Maze',
    generate: () => undefined,
  },
  {
    id: 'randomMaze',
    name: 'Random Maze',
    generate: randomMaze,
  },
  {
    id: 'recursiveDivisionMazeH',
    name: 'Recursive Division (Horizontal)',
    generate: (grid) => recursiveDivisionMaze(grid, 'horizontal'),
  },
  {
    id: 'recursiveDivisionMazeV',
    name: 'Recursive Division (Vertical)',
    generate: (grid) => recursiveDivisionMaze(grid, 'vertical'),
  },
];

export function getMaze(id: string) {
  return mazes.find((maze) => maze.id === id);
}
