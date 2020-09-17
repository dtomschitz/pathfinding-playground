import { AlgorithmOptions, Node, AlgorithmCallbacks, Path } from '../../models';
import { Heuristics } from '../heuristic';
import { Heap } from '../heap';
import { Utils } from '../utils';
import { Grid } from '../grid';

export function astar(grid: Grid, callbacks: AlgorithmCallbacks, options?: AlgorithmOptions): Path {
  const heuristic = options?.heuristic ?? Heuristics.manhatten;
  const weight = options?.weight ?? 1;

  const startNode = grid.startNode;
  const targetNode = grid.targetNode;

  startNode.g = 0;
  startNode.f = 0;

  const openList = new Heap<Node>((a, b) => a.f - b.f);
  const SQRT2 = Math.SQRT2;

  openList.push(startNode);
  startNode.status = 'opened';
  callbacks.opened(startNode, 0);

  let i = 0;
  while (!openList.empty()) {
    const node = openList.pop();
    node.status = 'closed';
    callbacks.closed(node, i);

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
      const tentativeG = node.g + (x - node.x === 0 || y - node.y === 0 ? 1 : SQRT2);

      if (neighbor.status !== 'opened' || tentativeG < neighbor.g) {
        neighbor.g = tentativeG;
        neighbor.h = neighbor.h || weight * heuristic(Math.abs(x - targetNode.x), Math.abs(y - targetNode.y));
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.parent = node;

        if (neighbor.status !== 'opened') {
          openList.push(neighbor);
          neighbor.status = 'opened';
          callbacks.opened(node, i);
        } else {
          openList.updateItem(neighbor);
        }
      }
    }

    i++;
  }

  return [];
}
