import { Node, NodeType, NodeCoordinates, Algorithm } from '../models';

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

  build() {
    this.nodes = new Array(this.height);

    for (let y = 0; y < this.height; y++) {
      this.nodes[y] = new Array<Node>(this.width);
      for (let x = 0; x < this.width; x++) {
        const type = this.getNodeType(x, y);

        this.nodes[y][x] = {
          id: `${y}-${x}`,
          x,
          y,
          type,
        };

        if (type === NodeType.START) {
          this.start = { x, y };
        } else if (type === NodeType.TARGET) {
          this.target = { x, y };
        }
      }
    }
  }

  findPath(algorithm: Algorithm) {
    return algorithm.fn(this);
  }

    reset() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const { id, x: nodeX, y: nodeY, type } = this.nodes[y][x];
        this.nodes[y][x] = {
          id,
          x: nodeX,
          y: nodeY,
          type,
        };
      }
    }
  }

  getNode(x: number, y: number) {
    return this.nodes[y][x];
  }

  isWalkable(x: number, y: number) {
    return this.isInside(x, y) && this.nodes[y][x].type !== NodeType.WALL;
  }

  isInside(x: number, y: number) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  getNeighbors(node: Node): Node[] {
    const { x, y } = node;
    const neighbors: Node[] = [];

    if (this.isWalkable(x + 1, y)) {
      neighbors.push(this.nodes[y][x + 1]);
    }

    if (this.isWalkable(x - 1, y)) {
      neighbors.push(this.nodes[y][x - 1]);
    }

    if (this.isWalkable(x, y + 1)) {
      neighbors.push(this.nodes[y + 1][x]);
    }

    if (this.isWalkable(x, y - 1)) {
      neighbors.push(this.nodes[x][y - 1]);
    }

    return neighbors;
  }

  private getNodeType(x: number, y: number) {
    if (y === Math.floor(this.height / 2) && x === Math.floor(this.width / 4)) {
      return NodeType.START;
    } else if (y === Math.floor(this.height / 2) && x === Math.floor((3 * this.width) / 4)) {
      return NodeType.TARGET;
    }

    return NodeType.DEFAULT;
  }
}
