import { Node, NodeType, NodeCoordinates, AlgorithmOperation } from '../models';
import { getAlgorithm } from './algorithms';

export class Grid {
  nodes: Node[][];
  start: NodeCoordinates;
  target: NodeCoordinates;

  constructor(public width: number, public height: number, public nodeSize: number) {}

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

  findPath(algorithmId: string): { path: number[][]; operations: AlgorithmOperation[] } {
    const algorithm = getAlgorithm(algorithmId);
    const operations: AlgorithmOperation[] = [];

    const path = algorithm.fn(this, {
      opened: ({ x, y }, i) => {
        operations.push({
          x,
          y,
          status: 'opened',
        });
      },
      closed: ({ x, y }, i) => {
        operations.push({
          x,
          y,
          status: 'closed',
        });
      },
    });

    return { path, operations };
  }

  reset() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const { id, x: nodeX, y: nodeY, type } = this.nodes[y][x];
        this.nodes[y][x] = {
          id,
          x: nodeX,
          y: nodeY,
          type: type === NodeType.START || type === NodeType.TARGET ? type : NodeType.DEFAULT,
        };
      }
    }
  }

  resetWalls() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const { id, x: nodeX, y: nodeY, type } = this.nodes[y][x];
        this.nodes[y][x] = {
          id,
          x: nodeX,
          y: nodeY,
          type: type !== NodeType.WALL ? type : NodeType.DEFAULT,
        };
      }
    }
  }

  resetPath() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const { id, x: nodeX, y: nodeY, type } = this.nodes[y][x];
        this.nodes[y][x] = {
          id,
          x: nodeX,
          y: nodeY,
          type,
          isPath: false,
        };
      }
    }
  }

  resetSteps() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const { id, x: nodeX, y: nodeY, type, isPath } = this.nodes[y][x];
        this.nodes[y][x] = {
          id,
          x: nodeX,
          y: nodeY,
          type,
          isPath,
        };
      }
    }
  }

  getNode(x: number, y: number) {
    return this.nodes[y][x];
  }

  getNodeAt(x: number, y: number) {
    //  console.log(Math.floor(x / this.nodeSize), Math.floor(y / this.nodeSize));

    // return this.nodes[`${Math.floor(y / this.nodeSize)}-${Math.floor(x / this.nodeSize)}`];
    return this.getNode(Math.floor(x / this.nodeSize), Math.floor(y / this.nodeSize));
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

    if (this.isWalkable(x, y - 1)) {
      neighbors.push(this.nodes[y - 1][x]);
    }

    if (this.isWalkable(x + 1, y)) {
      neighbors.push(this.nodes[y][x + 1]);
    }

    if (this.isWalkable(x, y + 1)) {
      neighbors.push(this.nodes[y + 1][x]);
    }

    if (this.isWalkable(x - 1, y)) {
      neighbors.push(this.nodes[y][x - 1]);
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
