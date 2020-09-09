import { Node, NodeType, NodeCoordinates, AlgorithmOperation, Path, Nodes } from '../models';
import { getAlgorithm } from './algorithms';
import { getMaze } from './mazes';

export class Grid {
  nodes: Nodes;
  start: string;
  target: string;

  constructor(public width: number, public height: number, public nodeSize: number) {}

  build() {
    // this.nodes = new Array(this.height);
    this.nodes = {};

    for (let y = 0; y < this.height; y++) {
      // this.nodes[y] = new Array<Node>(this.width);
      for (let x = 0; x < this.width; x++) {
        const id = `${y}-${x}`;
        const type = this.getNodeType(x, y);

        this.nodes[id] = {
          id,
          x,
          y,
          type,
        };

        if (type === NodeType.START) {
          this.start = id;
        } else if (type === NodeType.TARGET) {
          this.target = id;
        }
      }
    }
  }

  findPath(algorithmId: string): { path: Path; operations: AlgorithmOperation[] } {
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

  generateMaze(mazeId: string) {
    const maze = getMaze(mazeId);
    maze.generate(this);
  }

  reset() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        /* const { id, x: nodeX, y: nodeY, type } = this.nodes[y][x];
        this.nodes[y][x] = {
          id,
          x: nodeX,
          y: nodeY,
          type: type === NodeType.START || type === NodeType.TARGET ? type : NodeType.DEFAULT,
        };*/
      }
    }
  }

  resetWalls() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        /*const { id, x: nodeX, y: nodeY, type, isPath, status } = this.nodes[y][x];
        this.nodes[y][x] = {
          id,
          x: nodeX,
          y: nodeY,
          type: type !== NodeType.WALL ? type : NodeType.DEFAULT,
          isPath,
          status,
        };*/
      }
    }
  }

  resetPath() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        /*const { id, x: nodeX, y: nodeY, type } = this.nodes[y][x];
        this.nodes[y][x] = {
          id,
          x: nodeX,
          y: nodeY,
          type,
          isPath: false,
        };*/
      }
    }
  }

  resetSteps() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        /*const { id, x: nodeX, y: nodeY, type, isPath } = this.nodes[y][x];
        this.nodes[y][x] = {
          id,
          x: nodeX,
          y: nodeY,
          type,
          isPath,
        };*/
      }
    }
  }

  getNode(x: number, y: number) {
    //return this.nodes[y][x];
    return this.nodes[`${y}-${x}`];
  }

  getNodeAt(x: number, y: number) {
    //  console.log(Math.floor(x / this.nodeSize), Math.floor(y / this.nodeSize));

    // return this.nodes[`${Math.floor(y / this.nodeSize)}-${Math.floor(x / this.nodeSize)}`];
    return this.getNode(Math.floor(x / this.nodeSize), Math.floor(y / this.nodeSize));
  }

  get startNode() {
    const { x, y } = this.getNodeCoordinates(this.start);
    return this.getNode(x, y);
  }

  get targetNode() {
    const { x, y } = this.getNodeCoordinates(this.target);
    return this.getNode(x, y);
  }

  getNodeCoordinates(id: string){
    const coordinates = id.split('-');
    return { x: +coordinates[1], y: +coordinates[0] };
  }

  isWalkable(x: number, y: number) {
    return this.isInside(x, y) && this.getNode(x, y).type !== NodeType.WALL;
  }

  isInside(x: number, y: number) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  getNeighbors(node: Node): Node[] {
    const { x, y } = node;
    const neighbors: Node[] = [];

    if (this.isWalkable(x, y - 1)) {
      neighbors.push(this.getNode(x, y - 1));
      // neighbors.push(this.nodes[y - 1][x]);
    }

    if (this.isWalkable(x + 1, y)) {
      // neighbors.push(this.nodes[y][x + 1]);
      neighbors.push(this.getNode(x + 1, y));
    }

    if (this.isWalkable(x, y + 1)) {
      neighbors.push(this.getNode(x, y + 1));
      // neighbors.push(this.nodes[y + 1][x]);
    }

    if (this.isWalkable(x - 1, y)) {
      neighbors.push(this.getNode(x - 1, y));
      // neighbors.push(this.nodes[y][x - 1]);
    }

    return neighbors;
  }

  setStartNode({ x, y }: Node) {
    this.start = `${y}-${x}`;
  }

  setTargetNode({ x, y }: Node) {
    this.target = `${y}-${x}`;
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
