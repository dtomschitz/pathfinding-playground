import { Grid, Node, getNodeCoordinatesById, NodeType, Neighbors, Distance, Coordinates } from '../models';

export function bidirectional(grid: Grid, startNode: Node, targetNode: Node, middleNode: Node) {
  if (!startNode || !targetNode || startNode === targetNode) {
    return false;
  }

  const { x, y } = getNodeCoordinatesById(startNode.id);
  grid[x][y].distance = 0;
  grid[x][y].direction = 'right';
  grid[x][y].otherDistance = 0;
  grid[x][y].otherDirection = 'left';

  const nodes: string[] = ([] as Node[])
    .concat(...grid)
    .filter((node) => node.type !== NodeType.START && node.type !== NodeType.TARGET)
    .map((node) => node.id);

  const visitedNodes = {};
  const unvisitedNodesOne = [...nodes];
  const unvisitedNodesTwo = [...nodes];

  console.log('Fafƒ');

  while (unvisitedNodesOne.length && unvisitedNodesTwo.length) {
    let currentNode = closestNode(grid, unvisitedNodesOne);
    let secondCurrentNode = closestNodeTwo(grid, unvisitedNodesTwo);
    while (
      (currentNode.type === NodeType.WALL || secondCurrentNode.type === NodeType.WALL) &&
      unvisitedNodesOne.length &&
      unvisitedNodesTwo.length
    ) {
      if (currentNode.type === NodeType.WALL) {
        currentNode = closestNode(grid, unvisitedNodesOne);
      }
      if (secondCurrentNode.type === NodeType.WALL) {
        secondCurrentNode = closestNodeTwo(grid, unvisitedNodesTwo);
      }
    }
    if (currentNode.distance === Infinity || secondCurrentNode.otherDistance === Infinity) {
      return false;
    }
    // nodesToAnimate.push(currentNode);
    // nodesToAnimate.push(secondCurrentNode);

    currentNode.type = NodeType.VISITED;
    secondCurrentNode.type = NodeType.VISITED;

    if (visitedNodes[currentNode.id]) {
      middleNode = currentNode;
      return 'success';
    } else if (visitedNodes[secondCurrentNode.id]) {
      middleNode = secondCurrentNode;
      return 'success';
    } else if (currentNode === secondCurrentNode) {
      middleNode = secondCurrentNode;
      return 'success';
    }

    visitedNodes[currentNode.id] = true;
    visitedNodes[secondCurrentNode.id] = true;

    updateNeighbors(grid, currentNode, targetNode);
    updateNeighborsTwo(grid, secondCurrentNode, targetNode);
  }
}

function closestNode(grid: Grid, unvisitedNodes: string[]) {
  let currentClosest: Node;
  let index: number;

  for (let i = 0; i < unvisitedNodes.length; i++) {
    const { x, y } = getNodeCoordinatesById(unvisitedNodes[i]);
    if (!currentClosest || currentClosest.distance > grid[x][y].distance) {
      currentClosest = grid[x][y];
      index = i;
    }
  }

  unvisitedNodes.splice(index, 1);
  return currentClosest;
}

function closestNodeTwo(grid: Grid, unvisitedNodes: string[]) {
  let currentClosest: Node;
  let index: number;

  for (let i = 0; i < unvisitedNodes.length; i++) {
    const { x, y } = getNodeCoordinatesById(unvisitedNodes[i]);
    if (!currentClosest || currentClosest.otherDistance > grid[x][y].otherDistance) {
      currentClosest = grid[x][y];
      index = i;
    }
  }

  unvisitedNodes.splice(index, 1);
  return currentClosest;
}

function updateNeighbors(grid: Grid, node: Node, targetNode: Node) {
  const neighbors = getNeighbors(node.id, grid);
  for (const { x, y } of neighbors) {
    updateNode(node, grid[x][y], grid[targetNode.row][targetNode.column]);
  }
}

function updateNeighborsTwo(grid: Grid, node: Node, targetNode: Node) {
  const neighbors = getNeighbors(node.id, grid);
  for (const { x, y } of neighbors) {
    updateNodeTwo(node, grid[x][y], grid[targetNode.row][targetNode.column]);
  }
}

function updateNode(currentNode: Node, targetNode: Node, actualTargetNode: Node) {
  const distance = getDistance(currentNode, targetNode);
  const weight = targetNode.weight === 15 ? 15 : 1;
  const distanceToCompare =
    currentNode.distance + (weight + distance[0]) * calculateManhattanDistance(targetNode, actualTargetNode);

  if (distanceToCompare < targetNode.distance) {
    targetNode.distance = distanceToCompare;
    targetNode.previousNode = currentNode.id;
    targetNode.path = distance[1];
    targetNode.direction = distance[2];
  }
}

function updateNodeTwo(currentNode: Node, targetNode: Node, actualTargetNode: Node) {
  const distance = getDistanceTwo(currentNode, targetNode);
  const weight = targetNode.weight === 15 ? 15 : 1;
  const distanceToCompare =
    currentNode.otherDistance + (weight + distance[0]) * calculateManhattanDistance(targetNode, actualTargetNode);
  if (distanceToCompare < targetNode.otherDistance) {
    targetNode.otherDistance = distanceToCompare;
    targetNode.otherPreviousNode = currentNode.id;
    targetNode.path = distance[1];
    targetNode.otherDirection = distance[2];
  }
}

function getNeighbors(id: string, grid: Grid): Neighbors {
  const { x, y } = getNodeCoordinatesById(id);

  const neighbors: Neighbors = [];

  if (grid[x - 1] && grid[x - 1][y]) {
    if (grid[x - 1][y].type !== NodeType.WALL) {
      neighbors.push({ x: x - 1, y });
    }
  }

  if (grid[x + 1] && grid[x + 1][y]) {
    if (grid[x + 1][y].type !== NodeType.WALL) {
      neighbors.push({ x: x + 1, y });
    }
  }

  if (grid[x][y - 1]) {
    if (grid[x][y - 1].type !== NodeType.WALL) {
      neighbors.push({ x, y: y - 1 });
    }
  }

  if (grid[x][y + 1]) {
    if (grid[x][y - 1].type !== NodeType.WALL) {
      neighbors.push({ x, y: y + 1 });
    }
  }

  return neighbors;
}

function getDistance(nodeOne: Node, nodeTwo: Node): Distance {
  const { x: x1, y: y1 } = getNodeCoordinatesById(nodeOne.id);
  const { x: x2, y: y2 } = getNodeCoordinatesById(nodeTwo.id);

  if (x2 < x1) {
    if (nodeOne.direction === 'up') {
      return [1, ['f'], 'up'];
    } else if (nodeOne.direction === 'right') {
      return [2, ['l', 'f'], 'up'];
    } else if (nodeOne.direction === 'left') {
      return [2, ['r', 'f'], 'up'];
    } else if (nodeOne.direction === 'down') {
      return [3, ['r', 'r', 'f'], 'up'];
    }
  } else if (x2 > x1) {
    if (nodeOne.direction === 'up') {
      return [3, ['r', 'r', 'f'], 'down'];
    } else if (nodeOne.direction === 'right') {
      return [2, ['r', 'f'], 'down'];
    } else if (nodeOne.direction === 'left') {
      return [2, ['l', 'f'], 'down'];
    } else if (nodeOne.direction === 'down') {
      return [1, ['f'], 'down'];
    }
  }
  if (y2 < y1) {
    if (nodeOne.direction === 'up') {
      return [2, ['l', 'f'], 'left'];
    } else if (nodeOne.direction === 'right') {
      return [3, ['l', 'l', 'f'], 'left'];
    } else if (nodeOne.direction === 'left') {
      return [1, ['f'], 'left'];
    } else if (nodeOne.direction === 'down') {
      return [2, ['r', 'f'], 'left'];
    }
  } else if (y2 > y1) {
    if (nodeOne.direction === 'up') {
      return [2, ['r', 'f'], 'right'];
    } else if (nodeOne.direction === 'right') {
      return [1, ['f'], 'right'];
    } else if (nodeOne.direction === 'left') {
      return [3, ['r', 'r', 'f'], 'right'];
    } else if (nodeOne.direction === 'down') {
      return [2, ['l', 'f'], 'right'];
    }
  }
}

function getDistanceTwo(nodeOne: Node, nodeTwo: Node): Distance {
  const { x: x1, y: y1 } = getNodeCoordinatesById(nodeOne.id);
  const { x: x2, y: y2 } = getNodeCoordinatesById(nodeTwo.id);

  if (x2 < x1) {
    if (nodeOne.otherDirection === 'up') {
      return [1, ['f'], 'up'];
    } else if (nodeOne.otherDirection === 'right') {
      return [2, ['l', 'f'], 'up'];
    } else if (nodeOne.otherDirection === 'left') {
      return [2, ['r', 'f'], 'up'];
    } else if (nodeOne.otherDirection === 'down') {
      return [3, ['r', 'r', 'f'], 'up'];
    }
  } else if (x2 > x1) {
    if (nodeOne.otherDirection === 'up') {
      return [3, ['r', 'r', 'f'], 'down'];
    } else if (nodeOne.otherDirection === 'right') {
      return [2, ['r', 'f'], 'down'];
    } else if (nodeOne.otherDirection === 'left') {
      return [2, ['l', 'f'], 'down'];
    } else if (nodeOne.otherDirection === 'down') {
      return [1, ['f'], 'down'];
    }
  }
  if (y2 < y1) {
    if (nodeOne.otherDirection === 'up') {
      return [2, ['l', 'f'], 'left'];
    } else if (nodeOne.otherDirection === 'right') {
      return [3, ['l', 'l', 'f'], 'left'];
    } else if (nodeOne.otherDirection === 'left') {
      return [1, ['f'], 'left'];
    } else if (nodeOne.otherDirection === 'down') {
      return [2, ['r', 'f'], 'left'];
    }
  } else if (y2 > y1) {
    if (nodeOne.otherDirection === 'up') {
      return [2, ['r', 'f'], 'right'];
    } else if (nodeOne.otherDirection === 'right') {
      return [1, ['f'], 'right'];
    } else if (nodeOne.otherDirection === 'left') {
      return [3, ['r', 'r', 'f'], 'right'];
    } else if (nodeOne.otherDirection === 'down') {
      return [2, ['l', 'f'], 'right'];
    }
  }
}

function calculateManhattanDistance(nodeOne: Node, nodeTwo: Node): number {
  const { x: x1, y: y1 } = getNodeCoordinatesById(nodeOne.id);
  const { x: x2, y: y2 } = getNodeCoordinatesById(nodeTwo.id);

  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

/*function weightedManhattanDistance(nodeOne: Node, nodeTwo: Node, grid: Grid) {
  const { x: x1, y: y1 } = getNodeCoordinatesById(nodeOne.id);
  const { x: x2, y: y2 } = getNodeCoordinatesById(nodeTwo.id);

  let xChange = Math.abs(x1 - x2);
  let yChange = Math.abs(y1 - y2);

  if (x1 < x2 && y1 < y2) {
    let additionalXChange = 0;
    let additionalYChange = 0;

    for (let x = x1; x <= x2; x++) {
      additionalXChange += grid[x][y1].weight;
    }

    for (let y = y1; y <= y2[1]; y++) {
      additionalYChange += grid[x2][y].weight;
    }

    let otherAdditionalXChange = 0;
    let otherAdditionalYChange = 0;

    for (let y = y1; y <= y1[1]; y++) {
      additionalYChange += grid[x1][y].weight;
    }

    for (let x = x1; x <= x2; x++) {
      additionalXChange += grid[x][y2].weight;
    }

    if (additionalXChange + additionalYChange < otherAdditionalXChange + otherAdditionalYChange) {
      xChange += additionalXChange;
      yChange += additionalYChange;
    } else {
      xChange += otherAdditionalXChange;
      yChange += otherAdditionalYChange;
    }

  } else if (x1 < x2 && y1 >= y2) {
    let additionalxChange = 0;
    let additionalyChange = 0;

    for (let x = x1; x <= x2; x++) {
      additionalxChange += grid[x][y1].weight;
    }

    for (let y = y1; y >= y2; y--) {
      additionalyChange += grid[x2][y].weight;
    }

    let otherAdditionalxChange = 0;
    let otherAdditionalyChange = 0;

    for (let y = y1; y >= y2; y--) {
      additionalyChange += grid[x1][y].weight;
    }

    for (let x = x1; x <= x2; x++) {
      additionalxChange += grid[x][y2].weight;
    }

    if (additionalxChange + additionalyChange < otherAdditionalxChange + otherAdditionalyChange) {
      xChange += additionalxChange;
      yChange += additionalyChange;
    } else {
      xChange += otherAdditionalxChange;
      yChange += otherAdditionalyChange;
    }

  } else if (nodeOneCoordinates[0] >= nodeTwoCoordinates[0] && nodeOneCoordinates[1] < nodeTwoCoordinates[1]) {
    let additionalxChange = 0,
      additionalyChange = 0;
    for (let currentx = nodeOneCoordinates[0]; currentx >= nodeTwoCoordinates[0]; currentx--) {
      let currentId = `${currentx}-${nodeOne.id.split('-')[1]}`;
      let currentNode = nodes[currentId];
      additionalxChange += currentNode.weight;
    }
    for (let currenty = nodeOneCoordinates[1]; currenty <= nodeTwoCoordinates[1]; currenty++) {
      let currentId = `${nodeTwoCoordinates[0]}-${currenty}`;
      let currentNode = nodes[currentId];
      additionalyChange += currentNode.weight;
    }

    let otherAdditionalxChange = 0,
      otherAdditionalyChange = 0;
    for (let currenty = nodeOneCoordinates[1]; currenty <= nodeTwoCoordinates[1]; currenty++) {
      let currentId = `${nodeOne.id.split('-')[0]}-${currenty}`;
      let currentNode = nodes[currentId];
      additionalyChange += currentNode.weight;
    }
    for (let currentx = nodeOneCoordinates[0]; currentx >= nodeTwoCoordinates[0]; currentx--) {
      let currentId = `${currentx}-${nodeTwoCoordinates[1]}`;
      let currentNode = nodes[currentId];
      additionalxChange += currentNode.weight;
    }

    if (additionalxChange + additionalyChange < otherAdditionalxChange + otherAdditionalyChange) {
      xChange += additionalxChange;
      yChange += additionalyChange;
    } else {
      xChange += otherAdditionalxChange;
      yChange += otherAdditionalyChange;
    }
  } else if (nodeOneCoordinates[0] >= nodeTwoCoordinates[0] && nodeOneCoordinates[1] >= nodeTwoCoordinates[1]) {
    let additionalxChange = 0,
      additionalyChange = 0;
    for (let currentx = nodeOneCoordinates[0]; currentx >= nodeTwoCoordinates[0]; currentx--) {
      let currentId = `${currentx}-${nodeOne.id.split('-')[1]}`;
      let currentNode = nodes[currentId];
      additionalxChange += currentNode.weight;
    }
    for (let currenty = nodeOneCoordinates[1]; currenty >= nodeTwoCoordinates[1]; currenty--) {
      let currentId = `${nodeTwoCoordinates[0]}-${currenty}`;
      let currentNode = nodes[currentId];
      additionalyChange += currentNode.weight;
    }

    let otherAdditionalxChange = 0,
      otherAdditionalyChange = 0;
    for (let currenty = nodeOneCoordinates[1]; currenty >= nodeTwoCoordinates[1]; currenty--) {
      let currentId = `${nodeOne.id.split('-')[0]}-${currenty}`;
      let currentNode = nodes[currentId];
      additionalyChange += currentNode.weight;
    }
    for (let currentx = nodeOneCoordinates[0]; currentx >= nodeTwoCoordinates[0]; currentx--) {
      let currentId = `${currentx}-${nodeTwoCoordinates[1]}`;
      let currentNode = nodes[currentId];
      additionalxChange += currentNode.weight;
    }

    if (additionalxChange + additionalyChange < otherAdditionalxChange + otherAdditionalyChange) {
      xChange += additionalxChange;
      yChange += additionalyChange;
    } else {
      xChange += otherAdditionalxChange;
      yChange += otherAdditionalyChange;
    }
  }

  return xChange + yChange;
}*/
