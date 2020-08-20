import { Node, NodeType, NodeCoordinates, Algorithm } from '../../models';

export class Grid {
  nodes: Node[][];
  start: NodeCoordinates;
  target: NodeCoordinates;

  width: number;
  height: number;

  constructor(width?: number, height?: number) {
    this.width = width;
    this.height = height;
  }

  buildGrid() {
    this.nodes = new Array(this.height);

    for (let row = 0; row < this.height; row++) {
      this.nodes[row] = new Array<Node>(this.width);
      for (let col = 0; col < this.width; col++) {
        const type = this.getNodeType(row, col);

        this.nodes[row][col] = {
          id: `${row}-${col}`,
          row,
          col,
          type,
        };

        if (type === NodeType.START) {
          this.start = { row, col };
        } else if (type === NodeType.TARGET) {
          this.target = { row, col };
        }
      }
    }
  }

  findPath(algorithm: Algorithm) {}

  getNode(row: number, col: number) {
    return this.nodes[row][col];
  }

  isWalkable(row: number, col: number) {
    return this.isInside(row, col) && this.nodes[row][col].type !== NodeType.WALL;
  }

  isInside(row: number, col: number) {
    return this.nodes[row] && this.nodes[row][col];
  }

  getNeighbors(node: Node): Node[] {
    const { row, col } = node;
    const neighbors: Node[] = [];

    if (this.isWalkable(row + 1, col)) {
      neighbors.push(this.nodes[row + 1][col]);
    }

    if (this.isWalkable(row - 1, col)) {
      neighbors.push(this.nodes[row - 1][col - 1]);
    }

    if (this.isWalkable(row, col - 1)) {
      neighbors.push(this.nodes[row][col - 1]);
    }

    if (this.isWalkable(row, col + 1)) {
      neighbors.push(this.nodes[row][col + 1]);
    }

    return neighbors;
  }

  private getNodeType(row: number, col: number) {
    if (row === Math.floor(this.height / 2) && col === Math.floor(this.width / 4)) {
      return NodeType.START;
    } else if (row === Math.floor(this.height / 2) && col === Math.floor((3 * this.width) / 4)) {
      return NodeType.TARGET;
    }

    return NodeType.DEFAULT;
  }
}
