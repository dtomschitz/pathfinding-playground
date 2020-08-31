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
    this.changeDetection.detach();
  }

  async visualizePath() {
    this.resetPath();

    const { path, operations } = this.grid.findPath(this.settings.algorithmId);
    await this.renderOperations(operations);
    await this.drawShortestPath(path);

    // this.runChangeDetection();
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

      // this.getNodeComponent(previousNode.id).detectChanges();
      // this.getNodeComponent(newNode.id).detectChanges();
      this.changeDetection.detectChanges();
    }
  }

  async renderOperations(operations: AlgorithmOperation[]) {
    for (const { x, y, status } of operations) {
      console.log(`${x}, ${y}, ${status}`);

      this.grid.getNode(x, y).status = status;
      this.getNodeComponentByCoordiantes(x, y).markForCheck();
      this.changeDetection.detectChanges();
      await this.delay(10);
    }

    this.runChangeDetection();
    this.changeDetection.detectChanges();
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

  async drawShortestPath(path: number[][]) {
    for (const [x, y] of path) {
      this.grid.getNode(x, y).isPath = true;
      this.getNodeComponentByCoordiantes(x, y).detectChanges();
    }
  }

  reset() {
    this.steps = undefined;
    this.currentStep = undefined;
    this.resetPath();
  }

  createMaze(maze: Maze) {
    maze.generatorFn(this.grid);
    this.runChangeDetection();
  }

  resetGrid() {
    this.grid.reset();
    this.changeDetection.detectChanges();
    this.runChangeDetection();
  }

  resetWalls() {
    this.grid.resetWalls();
    this.changeDetection.detectChanges();
    this.runChangeDetection();
  }

  resetPath() {
    this.grid.resetPath();
    this.changeDetection.detectChanges();
    this.runChangeDetection();
  }

  resetSteps() {
    this.grid.resetSteps();
    this.changeDetection.detectChanges();
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

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
