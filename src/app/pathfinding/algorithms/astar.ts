import { AlgorithmOptions, Node, AlgorithmCallbacks } from '../../models';
import { Heuristics } from '../heuristic';
import { Heap } from '../heap';
import { Utils } from '../utils';
import { Grid } from '../grid';

export function astar(grid: Grid, callbacks: AlgorithmCallbacks, options?: AlgorithmOptions): number[][] {
  const heuristic = options?.heuristic ?? Heuristics.manhatten;
  const weight = options?.weight ?? 1;

  const startX = grid.start.x;
  const startY = grid.start.y;
  const targetX = grid.target.x;
  const targetY = grid.target.y;

  const startNode = grid.getNode(startX, startY);
  const targetNode = grid.getNode(targetX, targetY);

  startNode.g = 0;
  startNode.f = 0;

  const openList = new Heap<Node>((a, b) => a.f - b.f);
  const SQRT2 = Math.SQRT2;

  openList.push(startNode);
  startNode.status = 'opened';

  let i = 0;
  while (!openList.empty()) {
    const node = openList.pop();
    callbacks.closed(node, i);
    node.s = 'closed';

    if (node === targetNode) {
      return Utils.backtrace(targetNode);
    }

    const neighbors = grid.getNeighbors(node);
    for (const neighbor of neighbors) {
      if (neighbor.s === 'closed') {
        continue;
      }

      const x = neighbor.x;
      const y = neighbor.y;
      const tentativeG = node.g + (x - node.x === 0 || y - node.y === 0 ? 1 : SQRT2);

      if (neighbor.s !== 'opened' || tentativeG < neighbor.g) {
        neighbor.g = tentativeG;
        neighbor.h = neighbor.h || weight * heuristic(Math.abs(x - targetX), Math.abs(y - targetY));
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.parent = node;

        if (neighbor.s !== 'opened') {
          openList.push(neighbor);
          callbacks.opened(node, i);
          neighbor.s = 'opened';
        } else {
          openList.updateItem(neighbor);
        }
      }
    }

    i++;
  }

  return [];
}
