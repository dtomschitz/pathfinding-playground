import { Grid, Node, NodeType } from '../models';

export function generateRandomMaze(grid: Grid) {
  const nodes: Node[] = [].concat(...grid);
  for (const node of nodes) {
    if (node.type === NodeType.START || node.type === NodeType.TARGET) {
      continue;
    }

    const random = Math.random();
    if (random < 0.25) {
      node.type = NodeType.WALL;
    }
  }
}
