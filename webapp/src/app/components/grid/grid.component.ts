import { Component, Input, OnInit, ChangeDetectionStrategy, ViewChildren, QueryList } from '@angular/core';
import { NodeType, Grid, Node, NodeDroppedEvent, Maze, Algorithm, getNodeCoordinatesById } from '../../models';
import { PaintingService, SettingsService } from '../../services';
import { NodeComponent } from '../node';

@Component({
  selector: 'grid',
  templateUrl: './grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridComponent implements OnInit {
  @Input() rows: number;
  @Input() columns: number;

  @ViewChildren(NodeComponent) nodeComponents: QueryList<NodeComponent>;

  grid: Grid = [];
  startNode: Node;
  targetNode: Node;
  middleNode: Node;

  isMouseEnabled = true;

  constructor(private settingsService: SettingsService, private mouseService: PaintingService) {}

  ngOnInit() {
    this.createGrid();
  }

  visualize(algorithm: Algorithm) {
    this.isMouseEnabled = false;
    this.resetPath();
    algorithm.fn(this.grid, this.startNode, this.targetNode, undefined);

    this.drawShortestPath();
    this.runChangeDetection();
    this.isMouseEnabled = true;
  }

  onMouseDown(event: MouseEvent) {
    if (this.isMouseEnabled) {
      event.preventDefault();
      event.stopPropagation();
      this.mouseService.lockMouse();
    }
  }

  onMouseUp(event: MouseEvent) {
    if (this.isMouseEnabled) {
      event.preventDefault();
      event.stopPropagation();
      this.mouseService.releaseMouse();
    }
  }

  onNodeDropped({ previousNode, newNode }: NodeDroppedEvent) {
    if (newNode.type !== NodeType.START && newNode.type !== NodeType.TARGET) {
      this.grid[newNode.row][newNode.column].type = previousNode.type;
      this.grid[previousNode.row][previousNode.column].type = NodeType.DEFAULT;

      this.runChangeDetection();

      const node = this.grid[newNode.row][newNode.column];
      if (node.type === NodeType.START) {
        this.startNode = node;
      } else if (node.type === NodeType.TARGET) {
        this.targetNode = node;
      }
    }
  }

  drawShortestPath() {
    const currentAlgorithm = this.settingsService.settings.algorithm;
    let currentNode: Node;

    //console.log(this.targetNode);

    if (currentAlgorithm !== 'bidirectional') {
      const { x, y } = getNodeCoordinatesById(this.targetNode.previousNode);
      currentNode = this.grid[x][y];

      while (currentNode.id !== this.startNode.id) {
        console.log(currentNode);

        currentNode.type = NodeType.PATH;
        const { x, y } = getNodeCoordinatesById(currentNode.previousNode);
        currentNode = this.grid[x][y];
      }

      return;
    }
  }

  createMaze(maze: Maze) {
    this.resetGrid();
    maze.generatorFn(this.grid, this.startNode, this.targetNode, this.rows, this.columns);
    this.runChangeDetection();
  }

  createGrid() {
    for (let row = 0; row < this.rows; row++) {
      const columns: Node[] = [];
      for (let column = 0; column < this.columns; column++) {
        const node: Node = {
          id: `${row}-${column}`,
          row,
          column,
          type: this.getNodeType(row, column),
        };

        columns.push(node);

        if (node.type === NodeType.START) {
          this.startNode = node;
        } else if (node.type === NodeType.TARGET) {
          this.targetNode = node;
        }
      }
      this.grid.push(columns);
    }
  }

  resetGrid() {
    for (const rows of this.grid) {
      for (const node of rows) {
        if (node.type !== NodeType.START && node.type !== NodeType.TARGET) {
          node.type = NodeType.DEFAULT;
        }
      }
    }
  }

  resetPath() {
    for (const rows of this.grid) {
      for (const node of rows) {
        if (node.type === NodeType.PATH || node.type === NodeType.VISITED) {
          node.type = NodeType.DEFAULT;
        }
      }
    }
  }

  runChangeDetection() {
    for (const component of this.nodeComponents) {
      component.markForCheck();
    }
  }

  trackByFn(node: Node) {
    return node.id;
  }

  getNodeType(row: number, column: number) {
    if (row === Math.floor(this.rows / 2) && column === Math.floor(this.columns / 4)) {
      return NodeType.START;
    } else if (row === Math.floor(this.rows / 2) && column === Math.floor((3 * this.columns) / 4)) {
      return NodeType.TARGET;
    }

    return NodeType.DEFAULT;
  }
}
