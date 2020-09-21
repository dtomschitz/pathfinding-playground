import { BehaviorSubject } from 'rxjs';
import { Node, NodeType, AlgorithmOperation, Path, Nodes } from '../models';
import { getAlgorithm } from '../pathfinding/algorithms';
import { getMaze } from '../pathfinding/mazes';

export class Grid {
  private readonly _nodes = new BehaviorSubject<Node[]>([]);
  private readonly _updatedNode = new BehaviorSubject<Node>(undefined);

  readonly nodes$ = this._nodes.asObservable();
  readonly updatedNode$ = this._updatedNode.asObservable();

  start: string;
  target: string;

  width: number;
  height: number;
  nodeSize: number;

  generateNodes(width: number, height: number, nodeSize: number) {
    // this.nodes = new Array(this.height);
    this.width = width;
    this.height = height;
    this.nodeSize = nodeSize;

    const nodes: Node[] = [];

    let index = 0;
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const id = `${y}-${x}`;
        const type = this.getNodeType(x, y);

        nodes[index] = {
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

        index++;
      }
    }

    this.nodes = nodes;
  }

  findPath(algorithmId: string): { path: Path; operations: AlgorithmOperation[] } {
    const algorithm = getAlgorithm(algorithmId);
    const operations: AlgorithmOperation[] = [];

    const path = algorithm.fn(this, {
      opened: ({ x, y }) => {
        operations.push({
          x,
          y,
          status: 'opened',
        });
      },
      closed: ({ x, y }) => {
        operations.push({
          x,
          y,
          status: 'closed',
        });
      },
    });

    return { path, operations: [...new Set(operations)] };
  }

  generateMaze(mazeId: string) {
    const nodes = getMaze(mazeId).generate(this);
    if (!nodes) {
      this.resetNodes(({ type }) => ({ type: type === NodeType.WALL ? NodeType.DEFAULT : type }));
      return;
    }

    for (const { x, y } of nodes) {
      this.updateNode(x, y, { type: NodeType.WALL });
    }
  }

  get startNode() {
    return this.getNodeById(this.start);
  }

  get targetNode() {
    return this.getNodeById(this.target);
  }

  get nodes() {
    return this._nodes.getValue();
  }

  set nodes(nodes: Node[]) {
    this._nodes.next(nodes);
  }

  getNode(x: number, y: number) {
    return this.getNodeById(`${y}-${x}`);
  }

  getNodeById(id: string) {
    return this.nodes.find((node) => node.id === id);
  }

  getNodeAt(x: number, y: number) {
    return this.getNode(Math.floor(x / this.nodeSize), Math.floor(y / this.nodeSize));
  }

  getNodeCoordinates(id: string) {
    const coordinates = id.split('-');
    return { x: +coordinates[1], y: +coordinates[0] };
  }

  setNodes(nodes: Node[]) {
    this.nodes = [...nodes];
  }

  updateNode(x: number, y: number, changes: Partial<Node>) {
    const node = this.getNodeById(`${y}-${x}`);
    if (node) {
      const index = this.nodes.indexOf(node);
      this.nodes[index] = {
        ...node,
        ...changes,
      };
      this.nodes = [...this.nodes];
      this._updatedNode.next(this.nodes[index]);
    }
  }

  resetNode(x: number, y: number, keep: Partial<Node>) {
    const node = this.getNodeById(`${y}-${x}`);
    if (node) {
      const index = this.nodes.indexOf(node);
      this.nodes[index] = {
        id: node.id,
        x: node.x,
        y: node.y,
        type: node.type,
        ...keep,
      };
      this.nodes = [...this.nodes];
      this._updatedNode.next(this.nodes[index]);
    }
  }

  resetNodes(keep?: (node: Node) => Partial<Node>) {
    const nodes: Node[] = [];
    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];
      nodes[i] = {
        id: node.id,
        x: node.x,
        y: node.y,
        type: node.type,
        ...keep(node),
      };
      this._updatedNode.next(nodes[i]);
    }

    this.nodes = [...nodes];
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
    }

    if (this.isWalkable(x + 1, y)) {
      neighbors.push(this.getNode(x + 1, y));
    }

    if (this.isWalkable(x, y + 1)) {
      neighbors.push(this.getNode(x, y + 1));
    }

    if (this.isWalkable(x - 1, y)) {
      neighbors.push(this.getNode(x - 1, y));
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
      console.log('dad');

      return NodeType.START;
    } else if (y === Math.floor(this.height / 2) && x === Math.floor((3 * this.width) / 4)) {
      return NodeType.TARGET;
    }

    return NodeType.DEFAULT;
  }
}
