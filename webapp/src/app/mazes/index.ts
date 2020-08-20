import { Maze } from '../models';
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

/*import { randomMaze } from './random-maze';
import { recursiveDivisionMaze } from './recursive-division-maze';

export const mazes: Maze[] = [
  {
    id: 'randomMaze',
    name: 'Random Maze',
    generatorFn: randomMaze,
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
*/
