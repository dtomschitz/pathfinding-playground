import { Grid } from '../pathfinding';
import { Node } from './node';

export interface Maze {
  id: string;
  name: string;
  generate: (grid: Grid) => Node[];
  props?: any;
}

export type Mazes = 'randomMaze' | undefined;
