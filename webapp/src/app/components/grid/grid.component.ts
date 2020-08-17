import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { NodeType, Grid, Node, NodeDroppedEvent } from '../../models';
import { PaintingService, SettingsService } from 'src/app/services';
import { NodeComponent } from '../node';

@Component({
  selector: 'grid',
  templateUrl: './grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridComponent implements OnInit {
  // @Input() height: number;
  // @Input() width: number;
  @Input() rows: number;
  @Input() columns: number;

  @ViewChildren(NodeComponent) nodes: QueryList<NodeComponent>;

  grid: Grid = [];
  isMouseEnabled = true;

  constructor(private settingsService: SettingsService, private mouseService: PaintingService) {}

  ngOnInit() {
    this.createGrid();
  }

  visualize() {
    this.isMouseEnabled = false;
    console.log(this.settingsService.settings);
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

  onNodeDropped(event: NodeDroppedEvent) {
    const previouseNode = event.previousNode;
    const newNode = event.newNode;

    if (newNode.type !== NodeType.START && newNode.type !== NodeType.TARGET) {
      this.grid[newNode.row][newNode.column].type = previouseNode.type;
      this.grid[previouseNode.row][previouseNode.column].type = NodeType.DEFAULT;

      this.runChangeDetection();
    }
  }

  createGrid() {
    for (let row = 0; row < this.rows; row++) {
      const columns: Node[] = [];
      for (let column = 0; column < this.columns; column++) {
        columns.push({
          id: `${row}-${column}`,
          row,
          column,
          type: this.getNodeType(row, column),
          isWall: false,
        });
      }
      this.grid.push(columns);
    }
  }

  resetGrid() {
    for (const rows of this.grid) {
      for (const node of rows) {
        node.isWall = false;
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
