import { AlgorithmCallbacks, AlgorithmOptions, Node } from 'src/app/models';
import { Grid } from '../grid';
import { Utils } from '../utils';

export function breadthFirst(grid: Grid, callbacks: AlgorithmCallbacks, options?: AlgorithmOptions) {
  const openList: Node[] = [];

  const startNode = grid.startNode;
  const targetNode = grid.targetNode;

  openList.push(startNode);
  startNode.status = 'opened';
  callbacks.opened(startNode);

  while (openList.length) {
    const node = openList.shift();
    callbacks.closed(node);
    node.status = 'closed';

    if (node === targetNode) {
      return Utils.backtrace(targetNode);
    }

    const neighbors = grid.getNeighbors(node);
    for (const neighbor of neighbors) {
      if (neighbor.status === 'opened' || neighbor.status === 'closed') {
        continue;
      }

      openList.push(neighbor);
      callbacks.opened(node);

      neighbor.status = 'opened';
      neighbor.parent = node;
    }
  }

  return [];
}
