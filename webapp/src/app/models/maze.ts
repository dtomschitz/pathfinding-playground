import { Grid } from './grid';
import { Node } from './node';

export interface Maze {
  id: string;
  name: string;
  generatorFn: (
    grid: Grid,
    startNode: Node,
    targetNode: Node,
    rowsCount: number,
    columnsCount: number,
    props?: any
  ) => void;
  props?: any;
}

export type Mazes = 'randomMaze' | undefined;
