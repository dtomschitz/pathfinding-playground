import { Grid } from '../components/grid';

export interface Maze {
  id: string;
  name: string;
  generatorFn: (grid: Grid) => void;
  props?: any;
}

export type Mazes = 'randomMaze' | undefined;
