import { Grid, Node, NodeType } from '../models';

type Name = 'bfs' | 'dfs';

export function unweightedSearch(grid: Grid, startNode: Node, targetNode: Node, name: Name) {
  if (!startNode || !targetNode || startNode === targetNode) {
    return false;
  }

  const structure = [grid[startNode.row][startNode.column]];
  const exploredNodes: { [key: string]: boolean } = { start: true };
  while (structure.length) {
    const currentNode = name === 'bfs' ? structure.shift() : structure.pop();

    if (name === 'dfs') {
      exploredNodes[currentNode.id] = true;
    }

    currentNode.type = NodeType.VISITED;

    if (currentNode.id === targetNode.id) {
      return true;
    }

    const currentNeighbors = getNeighbors(currentNode.id, grid, name);
    currentNeighbors.forEach((neighbor) => {
      if (!exploredNodes[neighbor.id]) {
        if (name === 'bfs') {
          exploredNodes[neighbor.id] = true;
        }
        grid[neighbor.row][neighbor.column].previousNode = currentNode.id;
        structure.push(grid[neighbor.row][neighbor.column]);
      }
    });
  }
  return false;
}

function getNeighbors(id: string, grid: Grid, name: Name) {
  const coordinates = id.split('-');
  const x = parseInt(coordinates[0]);
  const y = parseInt(coordinates[1]);
  const neighbors: Node[] = [];
  let potentialNeighbor: Node;

  if (grid[x - 1] && grid[x - 1][y]) {
    potentialNeighbor = grid[x - 1][y];
    if (potentialNeighbor.type !== NodeType.WALL) {
      if (name === 'bfs') {
        neighbors.push(potentialNeighbor);
      } else {
        neighbors.unshift(potentialNeighbor);
      }
    }
  }
  if (grid[x][y + 1]) {
    potentialNeighbor = grid[x][y + 1];
    if (potentialNeighbor.type !== NodeType.WALL) {
      if (name === 'bfs') {
        neighbors.push(potentialNeighbor);
      } else {
        neighbors.unshift(potentialNeighbor);
      }
    }
  }
  if (grid[x + 1] && grid[x + 1][y]) {
    potentialNeighbor = grid[x + 1][y];
    if (potentialNeighbor.type !== NodeType.WALL) {
      if (name === 'bfs') {
        neighbors.push(potentialNeighbor);
      } else {
        neighbors.unshift(potentialNeighbor);
      }
    }
  }
  if (grid[x][y - 1]) {
    potentialNeighbor = grid[x][y - 1];
    if (potentialNeighbor.type !== NodeType.WALL) {
      if (name === 'bfs') {
        neighbors.push(potentialNeighbor);
      } else {
        neighbors.unshift(potentialNeighbor);
      }
    }
  }
  return neighbors;
}
