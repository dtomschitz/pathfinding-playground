import { Component, Input, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Settings, Node, NodeType, PaintingMode, AlgorithmOperation } from '../../models';
import { PaintingService } from '../../services';
import { Grid } from '../../pathfinding';

const startIcon =
  'M24 4c-7.73 0-14 6.27-14 14 0 10.5 14 26 14 26s14-15.5 14-26c0-7.73-6.27-14-14-14zm0 19c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z';

@Component({
  selector: 'grid',
  templateUrl: './grid.component.html',
})
export class GridComponent implements OnInit, AfterViewInit {
  @Input() width: number;
  @Input() height: number;
  @Input() nodeSize: number;
  @Input() settings: Settings;

  @ViewChild('canvas') canvasRef: ElementRef<HTMLCanvasElement>;

  grid: Grid;

  draggedNode: Node;
  hoveredNode: Node;

  private xNodes: number;
  private yNodes: number;
  private pX: number;
  private pY: number;
  private paddingLeft: number;
  private paddingTop: number;
  private paddingRight: number;
  private paddingBottom: number;

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(private paintingService: PaintingService) {}

  private isMouseEnabled = true;

  ngOnInit() {
    this.calculateGridSizes();
  }

  ngAfterViewInit() {
    this.canvas = this.canvasRef.nativeElement;
    this.ctx = this.canvas.getContext('2d');

    this.grid = new Grid(this.xNodes, this.yNodes, this.nodeSize);
    this.grid.build();
    this.render();
  }

  async visualizePath() {
    this.resetPath();

    const { path, operations } = this.grid.findPath(this.settings.algorithmId);
    await this.renderOperations(operations);
    await this.renderPath(path);
  }

  lockMouse(event: MouseEvent) {
    if (this.isMouseEnabled) {
      event.preventDefault();
      event.stopPropagation();
      this.paintingService.lockMouse();
    }
  }

  releaseMouse(event: MouseEvent) {
    if (this.isMouseEnabled) {
      event.preventDefault();
      event.stopPropagation();
      this.paintingService.releaseMouse();
    }
  }

  onMouseDown(event: MouseEvent) {
    const node = this.grid.getNodeAt(event.offsetX, event.offsetY);
    if (this.isNodeStartOrTargetPoint(node)) {
      this.draggedNode = node;
      return;
    }

    this.updateNodeType(node, this.paintingService.mode === PaintingMode.CREATE ? NodeType.WALL : NodeType.DEFAULT);
  }

  onMouseMove(event: MouseEvent) {
    if (this.isMouseEnabled && this.paintingService.isMouseLocked) {
      const node = this.grid.getNodeAt(event.offsetX, event.offsetY);
      if (!node) {
        return;
      }

      if (this.isNodeStartOrTargetPoint(node)) {
        return;
      }

      if (this.draggedNode) {
        return;
      }

      this.updateNodeType(node, this.paintingService.mode === PaintingMode.CREATE ? NodeType.WALL : NodeType.DEFAULT);
    }
  }

  onMouseUp(event: MouseEvent) {
    if (this.isMouseEnabled) {
      if (this.draggedNode) {
        this.grid.getNodeAt(event.offsetX, event.offsetY).type = this.draggedNode.type;
        this.grid.getNode(this.draggedNode.x, this.draggedNode.y).type = NodeType.DEFAULT;
        this.draggedNode = undefined;

        this.render();
      }

      this.paintingService.updateMode(PaintingMode.CREATE);
    }
  }

  onContextMenu(event: MouseEvent) {
    if (this.isMouseEnabled) {
      event.preventDefault();

      const node = this.grid.getNodeAt(event.offsetX, event.offsetY);
      if (this.isNodeStartOrTargetPoint(node)) {
        return;
      }

      this.paintingService.updateMode(PaintingMode.ERASE);
      this.updateNodeType(node, this.paintingService.mode === PaintingMode.CREATE ? NodeType.WALL : NodeType.DEFAULT);
    }
  }

  resetPath() {
    this.grid.resetPath();
    this.render();
  }

  resetWalls() {
    this.grid.resetWalls();
    this.render();
  }

  reset() {
    this.grid.reset();
    this.render();
  }

  private updateNodeType(node: Node, type: NodeType) {
    node.type = type;
    node.isPath = false;
    this.render();
  }

  private paintNode(node: Node, color: string) {
    // node.color = color;
    this.render();
  }

  private calculateGridSizes() {
    this.xNodes = Math.floor(this.width / this.nodeSize);
    this.yNodes = Math.floor(this.height / this.nodeSize);
    this.pX = this.width - this.xNodes * this.nodeSize;
    this.pY = this.height - this.yNodes * this.nodeSize;
    this.paddingLeft = Math.ceil(this.pX / 2) - 0.5;
    this.paddingTop = Math.ceil(this.pY / 2) - 0.5;
    this.paddingRight = this.width - this.xNodes * this.nodeSize - this.paddingLeft;
    this.paddingBottom = this.height - this.yNodes * this.nodeSize - this.paddingTop;
  }

  private render() {
    this.clearCanvas();
    this.renderGrid();

    for (let y = this.paddingTop; y <= this.height - this.paddingBottom - this.paddingTop; y += this.nodeSize) {
      for (let x = this.paddingLeft; x <= this.width - this.paddingRight - this.paddingLeft; x += this.nodeSize) {
        const node = this.grid.getNodeAt(x, y);

        if (node.type === NodeType.START) {
          this.renderStartPoint(x, y);
        } else if (node.type === NodeType.TARGET) {
          this.renderTargetPoint(x, y);
        } else if (node.type === NodeType.WALL) {
          this.renderRect(x, y, 'black');
        } else if (node.status && !node.isPath) {
          this.renderRect(x, y, '#FFECB3');
        } else if (node.isPath) {
          this.renderRect(x, y, '#ffd740');
        }
      }
    }
  }

  private async renderPath(path: number[][]) {
    for (const [x, y] of path) {
      this.grid.getNode(x, y).isPath = true;
      this.render();
      await this.delay(5);
    }
  }

  private async renderOperations(operations: AlgorithmOperation[]) {
    for (const { x, y, status } of operations) {
      this.grid.getNode(x, y).status = status;
      this.render();
      await this.delay(2);
    }
  }

  private renderGrid() {
    this.ctx.strokeStyle = 'whitesmoke';
    this.ctx.beginPath();

    for (let x = this.paddingLeft; x <= this.width - this.paddingRight; x += this.nodeSize) {
      this.ctx.moveTo(x, this.paddingTop);
      this.ctx.lineTo(x, this.height - this.paddingBottom);
    }

    for (let y = this.paddingTop; y <= this.height - this.paddingBottom; y += this.nodeSize) {
      this.ctx.moveTo(this.paddingLeft, y);
      this.ctx.lineTo(this.width - this.paddingRight, y);
    }

    this.ctx.stroke();
  }

  private renderStartPoint(x: number, y: number) {
    this.renderRect(x, y, '#ffd740');
    this.renderIcon(x, y, 0.45, startIcon);
  }

  private renderTargetPoint(x: number, y: number) {
    this.renderRect(x, y, '#ffd740');
  }

  private renderRect(x: number, y: number, fillStyle?: string) {
    this.ctx.fillStyle = fillStyle;
    this.ctx.fillRect(
      Math.floor(x / this.nodeSize) * this.nodeSize + this.paddingLeft,
      Math.floor(y / this.nodeSize) * this.nodeSize + this.paddingTop,
      this.nodeSize,
      this.nodeSize
    );
  }

  private renderIcon(x: number, y: number, scale: number, icon: any, color = 'black') {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.fillStyle = color;
    this.ctx.scale(scale, scale);
    this.ctx.fill(new Path2D(icon));
    this.ctx.restore();
  }

  private clearCanvas() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  private isNodeStartOrTargetPoint(node: Node) {
    return node.type === NodeType.START || node.type === NodeType.TARGET;
  }

  private getNodeFillStyle(node: Node) {
    if (node.type === NodeType.START || node.type === NodeType.TARGET) {
      return 'yellow';
    } else if (node.type === NodeType.WALL) {
      return 'black';
    }
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/*import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
  ViewChildren,
  QueryList,
  ChangeDetectorRef,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Node, NodeDroppedEvent, Maze, Algorithm, NodeType, Settings, AlgorithmOperation } from '../../models';
import { PaintingService } from '../../services';
import { Grid } from '../../pathfinding';
import { NodeComponent } from '../node';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tick } from '@angular/core/testing';

@Component({
  selector: 'grid',
  templateUrl: './grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridComponent implements OnInit, AfterViewInit {
  @Input() width: number;
  @Input() height: number;
  @Input() nodeSize: number;
  @Input() settings: Settings;

  @ViewChild('canvas') canvasRef: ElementRef<HTMLCanvasElement>;

  // grid: Grid;
  nodes: Node[][] = [];

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private xNodes: number;
  private yNodes: number;
  private pX: number;
  private pY: number;
  private paddingLeft: number;
  private paddingTop: number;
  private paddingRight: number;
  private paddingBottom: number;

  private isMouseEnabled = true;

  constructor(
    private changeDetection: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private mouseService: PaintingService
  ) {}

  ngOnInit() {
    // this.grid = new Grid(this.width, this.height);
    // this.grid.build();
    this.calculateGridSizes();
  }

  ngAfterViewInit() {
    this.canvas = this.canvasRef.nativeElement;
    this.ctx = this.canvas.getContext('2d');

    this.createNodes();
    this.renderGrid();
    // this.renderNodes();
  }

  lockMouse(event: MouseEvent) {
    if (this.isMouseEnabled) {
      event.preventDefault();
      event.stopPropagation();
      this.mouseService.lockMouse();
    }
  }

  releaseMouse(event: MouseEvent) {
    if (this.isMouseEnabled) {
      event.preventDefault();
      event.stopPropagation();
      this.mouseService.releaseMouse();
    }
  }

  onMouseDown(event: MouseEvent) {
    //const { x, y } = this.getMousePosition(event);
    //console.log(`${x}, ${y}`);
    // const x = event.offsetX - this.nodeSize;
    // const y = event.offsetY - this.nodeSize;
    // const x = Math.floor((event.x * this.canvas.width) / this.canvas.width);
    // const y = Math.floor((event.y * this.canvas.height) / this.canvas.height);
    // const x;
    // console.log(x);

    console.log(this.paddingLeft);
    console.log(this.pY);

    //  const x = ~~(event.offsetX / this.nodeSize);
    // const y = ~~(event.offsetY / this.nodeSize);

    // console.log(x, y);

    /* for (let y = 1; y <= this.yNodes; y += 1) {
      for (let x = 1; x <= this.yNodes; x += 1) {
        if ()
      }
    }

    this.grid.getNode(x, y).type = NodeType.WALL;
    this.render();
    const rect = this.canvas.getBoundingClientRect();

    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    /*for (let y = this.paddingTop; y <= this.height - this.paddingBottom; y += this.nodeSize) {
      for (let x = this.paddingLeft; x <= this.width - this.paddingRight; x += this.nodeSize) {
        const node = this.nodes[y][x]
        if (mouseX >= this.pX + currentPixel.x && Mouse.x <= this.offset.x + currentPixel.x + currentPixel.w) {
          if (mouseY >= this.offset.y + currentPixel.y && Mouse.y <= this.offset.y + currentPixel.y + currentPixel.h) {
          }
        }
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(x, y, 28, 28);
      }
      
    }

    for (let y = 0; y < this.yNodes; y++) {
      for (let x = 0; x < this.xNodes; x++) {
        const node = this.nodes[y][x];
        if (node) {
          if (mouseX >= this.pX + node.x && mouseX <= this.pX + node.x + this.nodeSize) {
            if (mouseY >= this.pY + node.y && mouseY <= this.pY + node.y + this.nodeSize) {
              console.log('YES');
              node.type = NodeType.WALL;
              this.renderNodes();
            }
          }
        }
        // console.log(x, y, node);
      }
    }
  }

  private calculateGridSizes() {
    this.xNodes = Math.floor(this.width / this.nodeSize);
    this.yNodes = Math.floor(this.height / this.nodeSize);

    this.pX = this.width - this.xNodes * this.nodeSize;
    this.pY = this.height - this.yNodes * this.nodeSize;

    // console.log(this.pX);

    this.paddingLeft = Math.ceil(this.pX / 2) - 0.5;
    this.paddingTop = Math.ceil(this.pY / 2) - 0.5;
    this.paddingRight = this.width - this.xNodes * this.nodeSize - this.paddingLeft;
    this.paddingBottom = this.height - this.yNodes * this.nodeSize - this.paddingTop;
  }

  private createNodes() {
    this.nodes = new Array<Node[]>(this.yNodes);

    for (let y = 0; y < this.yNodes; y++) {
      this.nodes[y] = new Array<Node>(this.xNodes);
      for (let x = 0; x < this.xNodes; x++) {
        const type = this.getNodeType(x, y);

        this.nodes[y][x] = {
          id: `${y}-${x}`,
          x: x * this.nodeSize + this.pX,
          y: y * this.nodeSize + this.pY,
          type,
        };

        if (type === NodeType.START) {
          // this.start = { x, y };
        } else if (type === NodeType.TARGET) {
          // this.target = { x, y };
        }
      }
    }
  }

  private renderNodes() {
    for (let y = 0; y < this.yNodes; y++) {
      for (let x = 0; x < this.xNodes; x++) {
        const node = this.nodes[y][x];
        if (node.type === NodeType.WALL) {
          this.ctx.fillStyle = 'black';
          this.ctx.fillRect(node.x, node.y, 28, 28);
        }

        /** const node = this.grid.getNode(x, y);
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(x, y, 28, 28);
      }
    }
  }

  private renderGrid() {
    this.ctx.strokeStyle = 'lightgrey';
    this.ctx.beginPath();

    for (let x = this.paddingLeft; x <= this.width - this.paddingRight; x += this.nodeSize) {
      this.ctx.moveTo(x, this.paddingTop);
      this.ctx.lineTo(x, this.height - this.paddingBottom);
    }

    for (let y = this.paddingTop; y <= this.height - this.paddingBottom; y += this.nodeSize) {
      this.ctx.moveTo(this.paddingLeft, y);
      this.ctx.lineTo(this.width - this.paddingRight, y);
    }

    this.ctx.stroke();
  }

  private isMouseOnNode(event: MouseEvent) {
    const { x, y } = this.getMousePosition(event);
  }

  private getMousePosition(event: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  private paintNode(x: number, y: number) {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(x, y, 28, 28);
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

/*@Component({
  selector: 'grid',
  templateUrl: './grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridComponent implements OnInit, AfterViewInit {
  @Input() width: number;
  @Input() height: number;
  @Input() nodeSize: number;
  @Input() settings: Settings;

  @ViewChild('canvas') canvasRef: ElementRef<HTMLCanvasElement>;
  @ViewChildren(NodeComponent) nodeComponents: QueryList<NodeComponent>;

  grid: Grid;
  steps: AlgorithmOperation[][];
  currentStep: number;
  isMouseEnabled = true;

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private nX: number;
  private nY: number;
  private pX: number;
  private pY: number;
  private pL: number;
  private pT: number;
  private pR: number;
  private pB: number;

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

    this.calculateGridSizes();
  }

  ngAfterViewInit() {
    this.canvas = this.canvasRef.nativeElement;
    this.ctx = this.canvas.getContext('2d');

    this.renderGrid();
    // this.changeDetection.detach();
  }

  private calculateGridSizes() {
    this.nX = Math.floor(this.width / this.nodeSize) - 2;
    this.nY = Math.floor(this.height / this.nodeSize) - 2;
    this.pX = this.width - this.nX * this.nodeSize;
    this.pY = this.height - this.nY * this.nodeSize;

    this.pL = Math.ceil(this.pX / 2) - 0.5;
    this.pT = Math.ceil(this.pY / 2) - 0.5;
    this.pR = this.width - this.nX * this.nodeSize - this.pL;
    this.pB = this.height - this.nY * this.nodeSize - this.pT;
  }

  private renderGrid() {
    this.ctx.strokeStyle = 'lightgrey';
    this.ctx.beginPath();

    for (let x = this.pL; x <= this.width - this.pR; x += this.nodeSize) {
      this.ctx.moveTo(x, this.pT);
      this.ctx.lineTo(x, this.height - this.pB);
    }

    for (let y = this.pT; y <= this.height - this.pB; y += this.nodeSize) {
      this.ctx.moveTo(this.pL, y);
      this.ctx.lineTo(this.width - this.pR, y);
    }

    this.ctx.stroke();
  }

  async visualizePath() {
    this.resetPath();

    const { path, operations } = this.grid.findPath(this.settings.algorithmId);
    await this.renderOperations(operations);
    await this.drawShortestPath(path);

    // this.runChangeDetection();
  }

  lockMouse(event: MouseEvent) {
    if (this.isMouseEnabled) {
      event.preventDefault();
      event.stopPropagation();
      this.mouseService.lockMouse();
    }
  }

  releaseMouse(event: MouseEvent) {
    if (this.isMouseEnabled) {
      event.preventDefault();
      event.stopPropagation();
      this.mouseService.releaseMouse();
    }
  }

  onMouseDown(event: MouseEvent) {
    //const { x, y } = this.getMousePosition(event);
    //console.log(`${x}, ${y}`);
    // const x = event.offsetX - this.nodeSize;
    // const y = event.offsetY - this.nodeSize;

    const x = Math.floor((event.x * this.canvas.width) / this.canvas.width);
    const y = Math.floor((event.y * this.canvas.height) / this.canvas.height);

    console.log(x);

    this.paintNode(x, y);
  }

  getMousePosition(event: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();

    /*return {
      x: ~~(event.offsetX / this.nodeSize),
      y: ~~(event.offsetY / this.nodeSize),
    }; 
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  getNodePosition(event: MouseEvent) {
    return {
      x: ~~(event.offsetX / this.nodeSize),
      y: ~~(event.offsetY / this.nodeSize),
    };
  }

  paintNode(x: number, y: number) {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(x, y, 28, 28);
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
      this.grid.getNode(x, y).status = status;
      this.getNodeComponentByCoordiantes(x, y).detectChanges();
      this.changeDetection.detectChanges();
      await this.delay(10);
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
}*/
