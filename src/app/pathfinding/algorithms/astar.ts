import { AlgorithmOptions, Node } from '../../models';
import { Heuristics } from '../heuristic';
import { Heap } from '../heap';
import { Utils } from '../utils';
import { Grid } from '../grid';

export function astar(grid: Grid, options?: AlgorithmOptions): number[][] {
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

  openList.push(startNode);
  startNode.opened = true;

  let node: Node;
  while (!openList.empty()) {
    node = openList.pop();
    node.closed = true;

    if (node === targetNode) {
      return Utils.backtrace(targetNode);
    }

    const neighbors = grid.getNeighbors(node);
    for (let i = 0, l = neighbors.length; i < l; ++i) {
      const neighbor = neighbors[i];

      if (neighbor.closed) {
        continue;
      }

      const x = neighbor.x;
      const y = neighbor.y;
      const ng = node.g + (x - node.x === 0 || y - node.y === 0 ? 1 : Math.SQRT2);

      if (!neighbor.opened || ng < neighbor.g) {
        neighbor.g = ng;
        neighbor.h = neighbor.h || weight * heuristic(Math.abs(x - targetX), Math.abs(y - targetY));
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.parent = node;

        if (!neighbor.opened) {
          openList.push(neighbor);
          neighbor.opened = true;
        } else {
          openList.updateItem(neighbor);
        }
      }
    }
  }

  return [];
}
