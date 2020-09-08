import { Grid } from '../pathfinding';

export interface Maze {
  id: string;
  name: string;
  generate: (grid: Grid) => void;
  props?: any;
}

export type Mazes = 'randomMaze' | undefined;
