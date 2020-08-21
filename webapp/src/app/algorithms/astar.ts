import { Grid } from '../components';
import { AlgorithmOptions, Node } from '../models';
import { Heuristics } from './heuristic';
import { Heap } from './heap';
import { Utils } from './utils';

export function astar(grid: Grid, options?: AlgorithmOptions) {
  const heuristic = options?.heuristic ?? Heuristics.manhatten;
  const weight = options?.weight ?? 1;

  const startNode = grid.getNode(grid.start.row, grid.start.col);
  const targetNode = grid.getNode(grid.target.row, grid.target.col);
  const targetX = grid.target.row;
  const targetY = grid.target.col;

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

      const x = neighbor.row;
      const y = neighbor.col;

      const ng = node.g + (x - node.row === 0 || y - node.col === 0 ? 1 : Math.SQRT2);

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
}
