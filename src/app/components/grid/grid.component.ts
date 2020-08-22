import { Component, Input, OnInit, ChangeDetectionStrategy, ViewChildren, QueryList } from '@angular/core';
import { Node, NodeDroppedEvent, Maze, Algorithm, NodeType } from '../../models';
import { PaintingService, SettingsService } from '../../services';
import { Grid } from '../../pathfinding';
import { NodeComponent } from '../node';

@Component({
  selector: 'grid',
  templateUrl: './grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridComponent implements OnInit {
  @Input() width: number;
  @Input() height: number;

  @ViewChildren(NodeComponent) nodeComponents: QueryList<NodeComponent>;

  grid: Grid;
  startNode: Node;
  targetNode: Node;
  middleNode: Node;

  isMouseEnabled = true;

  constructor(private settingsService: SettingsService, private mouseService: PaintingService) {
    this.grid = new Grid();
  }

  ngOnInit() {
    this.grid.width = this.width;
    this.grid.height = this.height;
    this.grid.build();
    // this.createGrid();
  }

  visualize(algorithm: Algorithm) {
    this.isMouseEnabled = false;

    this.grid.reset();
    this.runChangeDetection();
    this.drawShortestPath(this.grid.findPath(algorithm));

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
    /*if (newNode.type !== NodeType.START && newNode.type !== NodeType.TARGET) {
      this.grid[newNode.row][newNode.column].type = previousNode.type;
      this.grid[previousNode.row][previousNode.column].type = NodeType.DEFAULT;

      this.runChangeDetection();

      const node = this.grid[newNode.row][newNode.column];
      if (node.type === NodeType.START) {
        this.startNode = node;
      } else if (node.type === NodeType.TARGET) {
        this.targetNode = node;
      }
    }*/
  }

  drawShortestPath(path: number[][]) {
    for (const [x, y] of path) {
      const component = this.nodeComponents.find((c) => c.node.x === x && c.node.y === y);
      this.grid.getNode(x, y).isPath = true;
      component.markForCheck();
    }
  }

  createMaze(maze: Maze) {
    maze.generatorFn(this.grid);
    this.runChangeDetection();
  }

  /*createGrid() {
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
  }*/

  runChangeDetection() {
    for (const component of this.nodeComponents) {
      component.markForCheck();
    }
  }

  trackByFn(node: Node) {
    return node.id;
  }

  /*getNodeType(row: number, column: number) {
    if (row === Math.floor(this.rows / 2) && column === Math.floor(this.columns / 4)) {
      return NodeType.START;
    } else if (row === Math.floor(this.rows / 2) && column === Math.floor((3 * this.columns) / 4)) {
      return NodeType.TARGET;
    }

    return NodeType.DEFAULT;
  }*/
}
