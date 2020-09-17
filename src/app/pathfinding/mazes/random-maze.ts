import { Node, NodeType } from '../../models';
import { Grid } from '../grid';

export function randomMaze(grid: Grid) {
  const maze: Node[] = [];
  for (const node of grid.nodes) {
    if (node.type === NodeType.START || node.type === NodeType.TARGET) {
      continue;
    }

    const random = Math.random();
    if (random < 0.25) {
      maze.push(node);
    }
  }

  return maze;
}
