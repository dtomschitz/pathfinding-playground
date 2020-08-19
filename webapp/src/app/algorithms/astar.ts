import { Grid, Node, NodeType, Distance, getNodeCoordinatesById } from '../models';

export function astar(grid: Grid, startNode: Node, targetNode: Node) {
  if (!startNode || !targetNode || startNode === targetNode) {
    return false;
  }

  const { x, y } = getNodeCoordinatesById(startNode.id);
  grid[x][y].distance = 0;
  grid[x][y].totalDistance = 0;
  grid[x][y].direction = 'up';

  const nodes: Node[] = ([] as Node[])
    .concat(...grid)
    .filter((node) => node.type !== NodeType.START && node.type !== NodeType.TARGET);

  const unvisitedNodes = [...nodes];
  while (unvisitedNodes.length) {
    console.log(unvisitedNodes);

    let currentNode = closestNode(grid, unvisitedNodes);
    while (currentNode.type === NodeType.WALL && unvisitedNodes.length) {
      console.log('dadadad');

      currentNode = closestNode(grid, unvisitedNodes);
    }

    if (currentNode.distance === Infinity) {
      return false;
    }

    currentNode.type = NodeType.VISITED;
    if (currentNode.id === targetNode.id) {
      return true;
    }

    updateNeighbors(grid, currentNode, targetNode);
  }
}

function closestNode(grid: Grid, unvisitedNodes: Node[]): Node {
  let currentClosest: Node;
  let index: number;

  for (let i = 0; i < unvisitedNodes.length; i++) {
    const unvisitedNode = unvisitedNodes[i];
    const node = grid[unvisitedNode.row][unvisitedNode.column];

    if (!currentClosest || currentClosest.totalDistance > node.totalDistance) {
      currentClosest = node;
      index = i;
    } else if (currentClosest.totalDistance === node.totalDistance) {
      if (currentClosest.heuristicDistance > node.heuristicDistance) {
        currentClosest = node;
        index = i;
      }
    }
  }

  unvisitedNodes.splice(index, 1);
  return currentClosest;
}

function updateNeighbors(grid: Grid, node: Node, targetNode?: Node) {
  const neighbors = getNeighbors(grid, node);
  for (const neighbor of neighbors) {
    if (targetNode) {
      updateNode(node, grid[neighbor.row][neighbor.column], targetNode);
    } else {
      updateNode(node, grid[neighbor.row][neighbor.column]);
    }
  }
}

function updateNode(currentNode: Node, targetNode: Node, actualTargetNode?: Node) {
  if (!targetNode.heuristicDistance) {
    targetNode.heuristicDistance = calculateManhattanDistance(targetNode, actualTargetNode);
  }

  const distance = getDistance(currentNode, targetNode);
  const distanceToCompare = currentNode.distance + targetNode.weight + distance[0];
  if (distanceToCompare < targetNode.distance) {
    targetNode.distance = distanceToCompare;
    targetNode.totalDistance = targetNode.distance + targetNode.heuristicDistance;
    targetNode.previousNode = currentNode.id;
    targetNode.path = distance[1];
    targetNode.direction = distance[2];
  }
}

function getNeighbors(grid: Grid, node: Node): Node[] {
  const { x, y } = getNodeCoordinatesById(node.id);
  const neighbors: Node[] = [];
  let potentialNeighbor: Node;

  if (grid[x - 1] && grid[x - 1][y]) {
    potentialNeighbor = grid[x - 1][y];
    if (potentialNeighbor.type !== NodeType.WALL) {
      neighbors.push(potentialNeighbor);
    }
  }
  if (grid[x + 1] && grid[x + 1][y]) {
    potentialNeighbor = grid[x + 1][y];
    if (potentialNeighbor.type !== NodeType.WALL) {
      neighbors.push(potentialNeighbor);
    }
  }
  if (grid[x][y - 1]) {
    potentialNeighbor = grid[x][y - 1];
    if (potentialNeighbor.type !== NodeType.WALL) {
      neighbors.push(potentialNeighbor);
    }
  }
  if (grid[x][y + 1]) {
    potentialNeighbor = grid[x][y + 1];
    if (potentialNeighbor.type !== NodeType.WALL) {
      neighbors.push(potentialNeighbor);
    }
  }

  return neighbors;
}

function getDistance(nodeOne: Node, nodeTwo: Node): Distance {
  const { x: x1, y: y1 } = getNodeCoordinatesById(nodeOne.id);
  const { x: x2, y: y2 } = getNodeCoordinatesById(nodeTwo.id);

  if (x2 < x1 && y1 === y2) {
    if (nodeOne.direction === 'up') {
      return [1, ['f'], 'up'];
    } else if (nodeOne.direction === 'right') {
      return [2, ['l', 'f'], 'up'];
    } else if (nodeOne.direction === 'left') {
      return [2, ['r', 'f'], 'up'];
    } else if (nodeOne.direction === 'down') {
      return [3, ['r', 'r', 'f'], 'up'];
    } else if (nodeOne.direction === 'up-right') {
      return [1.5, null, 'up'];
    } else if (nodeOne.direction === 'down-right') {
      return [2.5, null, 'up'];
    } else if (nodeOne.direction === 'up-left') {
      return [1.5, null, 'up'];
    } else if (nodeOne.direction === 'down-left') {
      return [2.5, null, 'up'];
    }
  } else if (x2 > x1 && y1 === y2) {
    if (nodeOne.direction === 'up') {
      return [3, ['r', 'r', 'f'], 'down'];
    } else if (nodeOne.direction === 'right') {
      return [2, ['r', 'f'], 'down'];
    } else if (nodeOne.direction === 'left') {
      return [2, ['l', 'f'], 'down'];
    } else if (nodeOne.direction === 'down') {
      return [1, ['f'], 'down'];
    } else if (nodeOne.direction === 'up-right') {
      return [2.5, null, 'down'];
    } else if (nodeOne.direction === 'down-right') {
      return [1.5, null, 'down'];
    } else if (nodeOne.direction === 'up-left') {
      return [2.5, null, 'down'];
    } else if (nodeOne.direction === 'down-left') {
      return [1.5, null, 'down'];
    }
  }
  if (y2 < y1 && x1 === x2) {
    if (nodeOne.direction === 'up') {
      return [2, ['l', 'f'], 'left'];
    } else if (nodeOne.direction === 'right') {
      return [3, ['l', 'l', 'f'], 'left'];
    } else if (nodeOne.direction === 'left') {
      return [1, ['f'], 'left'];
    } else if (nodeOne.direction === 'down') {
      return [2, ['r', 'f'], 'left'];
    } else if (nodeOne.direction === 'up-right') {
      return [2.5, null, 'left'];
    } else if (nodeOne.direction === 'down-right') {
      return [2.5, null, 'left'];
    } else if (nodeOne.direction === 'up-left') {
      return [1.5, null, 'left'];
    } else if (nodeOne.direction === 'down-left') {
      return [1.5, null, 'left'];
    }
  } else if (y2 > y1 && x1 === x2) {
    if (nodeOne.direction === 'up') {
      return [2, ['r', 'f'], 'right'];
    } else if (nodeOne.direction === 'right') {
      return [1, ['f'], 'right'];
    } else if (nodeOne.direction === 'left') {
      return [3, ['r', 'r', 'f'], 'right'];
    } else if (nodeOne.direction === 'down') {
      return [2, ['l', 'f'], 'right'];
    } else if (nodeOne.direction === 'up-right') {
      return [1.5, null, 'right'];
    } else if (nodeOne.direction === 'down-right') {
      return [1.5, null, 'right'];
    } else if (nodeOne.direction === 'up-left') {
      return [2.5, null, 'right'];
    } else if (nodeOne.direction === 'down-left') {
      return [2.5, null, 'right'];
    }
  }
}

function calculateManhattanDistance(nodeOne: Node, nodeTwo: Node): number {
  const { x: x1, y: y1 } = getNodeCoordinatesById(nodeOne.id);
  const { x: x2, y: y2 } = getNodeCoordinatesById(nodeTwo.id);

  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}
