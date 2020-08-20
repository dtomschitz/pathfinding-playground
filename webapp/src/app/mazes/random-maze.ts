import { Node, NodeType } from '../models';
import { Grid } from '../components/grid/grid';

export function randomMaze(grid: Grid) {
  for (let i = 0; i < grid.height; i++) {
    for (let j = 0; j < grid.width; j++) {
      const node = grid.nodes[i][j];
      if (node.type === NodeType.START || node.type === NodeType.TARGET) {
        continue;
      }

      const random = Math.random();
      if (random < 0.25) {
        node.type = NodeType.WALL;
      }
    }
  }
}
