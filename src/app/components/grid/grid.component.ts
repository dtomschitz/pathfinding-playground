import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
  ViewChildren,
  QueryList,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import { Node, NodeDroppedEvent, Maze, Algorithm, NodeType, Settings, AlgorithmOperation } from '../../models';
import { PaintingService } from '../../services';
import { Grid } from '../../pathfinding';
import { NodeComponent } from '../node';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'grid',
  templateUrl: './grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridComponent implements OnInit, AfterViewInit {
  @Input() width: number;
  @Input() height: number;
  @Input() settings: Settings;

  @ViewChildren(NodeComponent) nodeComponents: QueryList<NodeComponent>;

  grid: Grid;
  hasOperation = false;
  steps: AlgorithmOperation[][];
  currentStep: number;
  isMouseEnabled = true;

  constructor(
    private changeDetection: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private mouseService: PaintingService
  ) {
    this.grid = new Grid();
  }

  ngOnInit() {
    this.grid.width = this.width;
    this.grid.height = this.height;
    this.grid.build();
  }

  ngAfterViewInit() {
    // this.changeDetection.detach();
  }

  visualizePath() {
    this.hasOperation = true;

    this.resetPath();

    const { path, steps } = this.grid.findPath(this.settings.algorithmId);
    this.steps = steps;
    /*if (path.length === 0) {
      this.snackBar.open('No path where found!', ':(', { duration: 2000 });
      return;
    }*/

    this.renderSteps(steps);
    this.drawShortestPath(path);
    this.runChangeDetection();
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
      this.grid.getNode(newNode.x, newNode.y).type = previousNode.type;
      this.grid.getNode(previousNode.x, previousNode.y).type = NodeType.DEFAULT;

      const node = this.grid.getNode(newNode.x, newNode.y);
      if (node.type === NodeType.START) {
        this.grid.start = node;
      } else if (node.type === NodeType.TARGET) {
        this.grid.target = node;
      }

      this.getNodeComponent(previousNode.id).markForCheck();
      this.getNodeComponent(newNode.id).markForCheck();
    }
  }

  renderSteps(operations: AlgorithmOperation[][]) {
    for (let i = 0; i < operations.length; i++) {
      this.currentStep = i;
      for (const { x, y, status } of operations[i]) {
        setTimeout(() => {
          this.grid.getNode(x, y).status = status;
          this.getNodeComponentByCoordiantes(x, y).detectChanges();
        }, 200);
      }
    }
  }

  jumpToStep(step: number) {
    this.resetSteps();

    for (let i = 0; i < step; i++) {
      this.currentStep = i;
      for (const { x, y, status } of this.steps[i]) {
        this.grid.getNode(x, y).status = status;
        this.getNodeComponentByCoordiantes(x, y).detectChanges();
      }
    }
  }

  drawShortestPath(path: number[][]) {
    for (const [x, y] of path) {
      this.grid.getNode(x, y).isPath = true;
      this.getNodeComponentByCoordiantes(x, y).detectChanges();
    }
  }

  createMaze(maze: Maze) {
    maze.generatorFn(this.grid);
    this.runChangeDetection();
  }

  resetGrid() {
    this.grid.reset();
  }

  resetWalls() {
    this.grid.resetWalls();
  }

  resetPath() {
    this.grid.resetPath();
  }

  resetSteps() {
    this.grid.resetSteps();
  }

  runChangeDetection() {
    for (const component of this.nodeComponents) {
      component.detectChanges();
    }
  }

  markForChecks() {
    for (const component of this.nodeComponents) {
      component.markForCheck();
    }
  }

  trackByFn(node: Node) {
    return node.id;
  }

  private getNodeComponent(id: string) {
    return this.nodeComponents.find((component) => component.node.id === id);
  }

  private getNodeComponentByCoordiantes(x: number, y: number) {
    return this.nodeComponents.find((component) => component.node.x === x && component.node.y === y);
  }
}
