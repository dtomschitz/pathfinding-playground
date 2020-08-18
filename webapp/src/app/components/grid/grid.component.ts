import { Component, Input, OnInit, ChangeDetectionStrategy, ViewChildren, QueryList } from '@angular/core';
import { NodeType, Grid, Node, NodeDroppedEvent, Settings, Maze, Algorithm } from '../../models';
import { PaintingService, SettingsService } from '../../services';
import { NodeComponent } from '../node';
import { algorithms } from 'src/app/algorithms';

@Component({
  selector: 'grid',
  templateUrl: './grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridComponent implements OnInit {
  @Input() rows: number;
  @Input() columns: number;

  @ViewChildren(NodeComponent) nodes: QueryList<NodeComponent>;

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

      const node = this.grid[newNode.row][newNode.column];

      if (node.type === NodeType.START) {
        this.startNode = node;
      } else if (node.type === NodeType.TARGET) {
        this.targetNode = node;
      }

      this.runChangeDetection();
    }
  }

  drawShortestPath() {
    const currentAlgorithm = this.settingsService.settings.algorithm;
    let currentNode: Node;

    const coordinates = this.targetNode.previousNode.split('-');
    const x = parseInt(coordinates[0]);
    const y = parseInt(coordinates[1]);

    currentNode = this.grid[x][y];

    while (currentNode.id !== this.startNode.id) {
      currentNode.type = NodeType.PATH;
      const coordinates = currentNode.previousNode.split('-');
      const x = parseInt(coordinates[0]);
      const y = parseInt(coordinates[1]);
      currentNode = this.grid[x][y];
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
          direction: undefined,
          distance: Infinity,
          totalDistance: Infinity,
          heuristicDistance: undefined,
          weight: 0,
          path: undefined,
          previousNode: undefined,
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

  runChangeDetection() {
    for (const component of this.nodes) {
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
