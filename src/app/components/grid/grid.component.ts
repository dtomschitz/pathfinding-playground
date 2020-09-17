import {
  Component,
  Input,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnDestroy,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Pixel } from '../../models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DrawingGridService } from '../../services';

@Component({
  selector: 'grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();

  @Input() width: number;
  @Input() height: number;
  @Input() xNodes: number;
  @Input() yNodes: number;
  @Input() pixelSize: number;
  @Input() disabled = false;

  @Output() mouseDown: EventEmitter<Pixel> = new EventEmitter<Pixel>();
  @Output() mouseMove: EventEmitter<Pixel> = new EventEmitter<Pixel>();
  @Output() mouseUp: EventEmitter<Pixel> = new EventEmitter<Pixel>();
  @Output() contextMenu: EventEmitter<Pixel> = new EventEmitter<Pixel>();

  @ViewChild('canvas') canvasRef: ElementRef<HTMLCanvasElement>;

  // pixels: { [key: string]: Pixel };
  renderingContext: CanvasRenderingContext2D;

  private paddingX: number;
  private paddingY: number;
  private paddingLeft: number;
  private paddingTop: number;
  private paddingRight: number;
  private paddingBottom: number;

  private isMouseLocked: boolean;
  private cachedPixel: Pixel;

  constructor(private gridService: DrawingGridService) {}

  ngOnInit() {
    this.gridService.isMouseLocked$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isMouseLocked) => (this.isMouseLocked = isMouseLocked));

    this.gridService.pixels$.pipe(takeUntil(this.destroy$)).subscribe((pixels) => {
      if (pixels && this.renderingContext) {
        this.render(pixels);
      }
    });

    this.calculateGridSizes();
    this.gridService.pixels = this.generatePixels();
  }

  ngAfterViewInit() {
    this.renderingContext = this.canvasRef.nativeElement.getContext('2d');

    this.clearCanvas();
    this.renderGrid();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onMouseDown(event: MouseEvent) {
    if (!this.disabled) {
      this.mouseDown.emit(this.getPixelAt(event.offsetX, event.offsetY));
    }
  }

  onMouseMove(event: MouseEvent) {
    if (!this.disabled && this.isMouseLocked) {
      const pixel = this.getPixelAt(event.offsetX, event.offsetY);

      if (this.cachedPixel && this.cachedPixel === pixel) {
        return;
      }

      this.cachedPixel = pixel;
      this.mouseMove.emit(this.getPixelAt(event.offsetX, event.offsetY));
    }
  }

  onMouseUp(event: MouseEvent) {
    if (!this.disabled && this.isMouseLocked) {
      this.mouseUp.emit(this.getPixelAt(event.offsetX, event.offsetY));
    }
  }

  onContextMenu(event: MouseEvent) {
    event.preventDefault();
    if (!this.disabled) {
      this.contextMenu.emit(this.getPixelAt(event.offsetX, event.offsetY));
    }
  }

  lockMouse(event: MouseEvent) {
    if (!this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      this.gridService.lockMouse();
    }
  }

  releaseMouse(event: MouseEvent) {
    if (!this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      this.gridService.releaseMouse();
    }
  }

  render(pixels: Pixel[]) {
    this.clearCanvas();

    ([] as Pixel[]).concat(...pixels).forEach((pixel) => {
      if (pixel.fillStyle) {
        this.renderingContext.fillStyle = pixel.fillStyle;
        this.renderingContext.fillRect(
          pixel.x * this.pixelSize + this.paddingLeft,
          pixel.y * this.pixelSize + this.paddingTop,
          this.pixelSize,
          this.pixelSize
        );
      }
    });

    this.renderGrid();
  }

  renderGrid() {
    this.renderingContext.strokeStyle = '#424242';
    this.renderingContext.beginPath();

    for (let x = this.paddingLeft; x <= this.width - this.paddingRight; x += this.pixelSize) {
      this.renderingContext.moveTo(x, this.paddingTop);
      this.renderingContext.lineTo(x, this.height - this.paddingBottom);
    }

    for (let y = this.paddingTop; y <= this.height - this.paddingBottom; y += this.pixelSize) {
      this.renderingContext.moveTo(this.paddingLeft, y);
      this.renderingContext.lineTo(this.width - this.paddingRight, y);
    }

    this.renderingContext.stroke();
  }

  resetPixels(skipFn?: (pixel: Pixel) => boolean) {
    /*if (skipFn) {
      ([] as Pixel[]).concat(...this.pixels).forEach((pixel) => {
        if (!skipFn(pixel)) {
          this.clearPixel(pixel.x, pixel.y);
        }
      });
      return;
    }

    this.generatePixels();
    this.render();*/
  }

  /*fillPixel(x: number, y: number, fillStyle: string) {
    this.pixels[y][x] = { ...this.pixels[y][x], fillStyle };
    this.render();
  }

  clearPixel(x: number, y: number) {
    this.pixels[y][x] = { ...this.pixels[y][x], fillStyle: undefined };
  }*/

  clearCanvas() {
    this.renderingContext.clearRect(0, 0, this.width, this.height);
  }

  private calculateGridSizes() {
    this.paddingX = this.width - this.xNodes * this.pixelSize;
    this.paddingY = this.height - this.yNodes * this.pixelSize;
    this.paddingLeft = Math.ceil(this.paddingX / 3) - 0.5;
    this.paddingTop = Math.ceil(this.paddingY / 3) - 0.5;
    this.paddingRight = this.width - this.xNodes * this.pixelSize - this.paddingLeft;
    this.paddingBottom = this.height - this.yNodes * this.pixelSize - this.paddingTop;
  }

  private generatePixels() {
    const pixels: Pixel[] = [];
    let index = 0;
    for (let y = 0; y < this.yNodes; y++) {
      for (let x = 0; x < this.xNodes; x++) {
        pixels[index] = {
          id: `${y}-${x}`,
          x,
          y,
        };

        index++;
      }
    }

    return pixels;
  }

  private getPixelAt(x: number, y: number) {
    return this.gridService.getPixel(Math.floor(x / this.pixelSize), Math.floor(y / this.pixelSize));
  }

  /*async visualizePath(algorithmId: string, delay?: number, operationsPerSecond?: number) {
    this.disableMouse();
    this.resetPath();

    const { path, operations } = this.grid.findPath(algorithmId);
    await this.renderOperations(operations, delay, operationsPerSecond);
    await this.renderPath(path);

    this.enableMouse();
  }

  generateMaze(mazeId: string) {
    this.reset();
    this.grid.generateMaze(mazeId);
    this.render();
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
    if (this.isMouseEnabled) {
      const node = this.grid.getNodeAt(event.offsetX, event.offsetY);
      if (this.isNodeStartOrTargetPoint(node)) {
        this.draggedNode = { x: node.x, y: node.y };
        return;
      }

      this.updateNodeType(node, this.paintingService.mode === PaintingMode.CREATE ? NodeType.WALL : NodeType.DEFAULT);
    }
  }

  onMouseMove(event: MouseEvent) {
    if (this.isMouseEnabled && this.paintingService.isMouseLocked) {
      const node = this.grid.getNodeAt(event.offsetX, event.offsetY);
      if (!node) {
        return;
      }

      if (this.draggedNode) {
        this.renderRect(node.x, node.y, '#1565C0');
        this.render();
        return;
      }

      if (this.isNodeStartOrTargetPoint(node)) {
        return;
      }

      this.updateNodeType(node, this.paintingService.mode === PaintingMode.CREATE ? NodeType.WALL : NodeType.DEFAULT);
    }
  }

  onMouseUp(event: MouseEvent) {
    if (this.isMouseEnabled) {
      if (this.draggedNode) {
        const newNode = this.grid.getNodeAt(event.offsetX, event.offsetY);
        const previouseNode = this.grid.getNode(this.draggedNode.x, this.draggedNode.y);

        newNode.type = previouseNode.type;
        previouseNode.type = NodeType.DEFAULT;

        if (newNode.type === NodeType.START) {
          this.grid.setStartNode(newNode);
        } else if (newNode.type === NodeType.TARGET) {
          this.grid.setTargetNode(newNode);
        }

        this.draggedNode = undefined;
        this.resetPath();
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

  private calculateGridSizes() {
    this.paddingX = this.width - this.xNodes * this.nodeSize;
    this.paddingY = this.height - this.yNodes * this.nodeSize;
    this.paddingLeft = Math.ceil(this.paddingX / 3) - 0.5;
    this.paddingTop = Math.ceil(this.paddingY / 3) - 0.5;
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
          this.renderRect(x, y, '#64B5F6');
        } else if (node.isPath) {
          this.renderRect(x, y, '#1565C0');
        }
      }
    }
  }

  private async renderPath(path: number[][], delay?: number) {
    for (const [x, y] of path) {
      this.grid.getNode(x, y).isPath = true;
      this.render();

      if (this.delay) {
        await this.delay(5);
      }
    }
  }

  private async renderOperations(operations: AlgorithmOperation[], delay?: number, operationsPerSecond?: number) {
    for (const { x, y, status } of operations) {
      this.grid.getNode(x, y).status = status;
      this.render();

      if (delay && operationsPerSecond) {
        await this.delay(1000 / operationsPerSecond);
      }
    }
  }

  private renderGrid() {
    this.ctx.strokeStyle = '#424242';
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
    this.renderRect(x, y, '#1565C0');
    this.renderIcon(x, y, 0.45, startIcon);
  }

  private renderTargetPoint(x: number, y: number) {
    this.renderRect(x, y, '#1565C0');
    this.renderIcon(x, y, 0.45, targetIcon);
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

  private renderIcon(x: number, y: number, scale: number, icon: any, color = 'white') {
    this.ctx.save();
    this.ctx.translate(x + 3.5, y + 3.5);
    this.ctx.fillStyle = color;
    this.ctx.scale(scale, scale);
    this.ctx.fill(new Path2D(icon));
    this.ctx.restore();
  }

  private clearCanvas() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  private enableMouse() {
    this.isMouseEnabled = true;
  }

  private disableMouse() {
    this.isMouseEnabled = false;
  }

  private isNodeStartOrTargetPoint(node: Node) {
    return node.type === NodeType.START || node.type === NodeType.TARGET;
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }*/
}
