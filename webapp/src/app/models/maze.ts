import { Grid } from './grid';

export interface Maze {
  id: string;
  name: string;
  generatorFn: (grid: Grid) => void;
}

export type Mazes = 'randomMaze' | undefined;
