import { Maze, Mazes } from '../models';
import { generateRandomMaze } from './random-maze';
import { recursiveDivisionMaze } from './recursive-division-maze';

export const mazes: Maze[] = [
  {
    id: 'randomMaze',
    name: 'Random Maze',
    generatorFn: generateRandomMaze,
  },
  {
    id: 'recursiveDivision',
    name: 'Basic Maze',
    generatorFn: (grid, startNode, targetNode, rowsCount, columnsCount) => {
      return recursiveDivisionMaze(grid, {
        startNode,
        targetNode,
        rowsCount,
        columnsCount,
        rowStart: 2,
        rowEnd: rowsCount - 3,
        columnStart: 2,
        columnEnd: columnsCount - 3,
        orientation: 'horizontal',
        surroundingWalls: false,
      });
    },
  },
];

export function getMaze(id: Mazes) {
  return mazes.find((maze) => maze.id === id);
}
