import { AlgorithmOptions, Node } from '../../models';
import { Heuristics } from '../heuristic';
import { Heap } from '../heap';
import { Utils } from '../utils';
import { Grid } from '../grid';

export function astar(grid: Grid, options?: AlgorithmOptions): number[][] {
  const heuristic = options?.heuristic ?? Heuristics.manhatten;
  const weight = options?.weight ?? 1;

  const SQRT2 = Math.SQRT2;

  const startX = grid.start.x;
  const startY = grid.start.y;
  const targetX = grid.target.x;
  const targetY = grid.target.y;

  const startNode = grid.getNode(startX, startY);
  const targetNode = grid.getNode(targetX, targetY);

  startNode.g = 0;
  startNode.f = 0;

  const openList = new Heap<Node>((a, b) => a.f - b.f);

  openList.push(startNode);
  startNode.status = 'opened';

  while (!openList.empty()) {
    const node = openList.pop();
    startNode.status = 'closed';

    if (node === targetNode) {
      return Utils.backtrace(targetNode);
    }

    const neighbors = grid.getNeighbors(node);
    for (const neighbor of neighbors) {
      if (neighbor.status === 'closed') {
        continue;
      }

      const x = neighbor.x;
      const y = neighbor.y;
      const ng = node.g + (x - node.x === 0 || y - node.y === 0 ? 1 : Math.SQRT2);

      if (neighbor.status !== 'opened' || ng < neighbor.g) {
        neighbor.g = ng;
        neighbor.h = neighbor.h || weight * heuristic(Math.abs(x - targetX), Math.abs(y - targetY));
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.parent = node;

        if (neighbor.status !== 'opened') {
          openList.push(neighbor);
          neighbor.status = 'opened';
        } else {
          openList.updateItem(neighbor);
        }
      }
    }
  }

  return [];
}
