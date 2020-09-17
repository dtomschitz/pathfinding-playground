import {
  Component,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef,
  ViewChild,
  AfterViewChecked,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AlgorithmOperation, Node, NodeCoordinates, NodeType, PaintingMode, Pixel, Settings } from './models';
import { DrawingGridService, SettingsService } from './services';
import { GridComponent } from './components';
import { Grid } from './pathfinding';

const startIcon =
  'M24 4c-7.73 0-14 6.27-14 14 0 10.5 14 26 14 26s14-15.5 14-26c0-7.73-6.27-14-14-14zm0 19c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z';
const targetIcon = 'M28.8 12L28 8H10v34h4V28h11.2l.8 4h14V12z';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, AfterViewInit, AfterViewChecked {
  private readonly destroy$: Subject<void> = new Subject<void>();

  @ViewChild(GridComponent) gridComponent: GridComponent;

  grid: Grid;
  settings: Settings;

  width: number;
  height: number;
  xNodes: number;
  yNodes: number;
  nodeSize = 28;
  visualizing: boolean;

  draggedNode: NodeCoordinates;
  hoveringNode: NodeCoordinates;

  isMouseEnabled = true;
  paintingMode: PaintingMode = PaintingMode.CREATE;

  constructor(
    private host: ElementRef,
    private changeDetector: ChangeDetectorRef,
    private gridService: DrawingGridService,
    private settingsService: SettingsService
  ) {
    this.grid = new Grid();
  }

  ngOnInit() {
    this.settingsService.settings$.pipe(takeUntil(this.destroy$)).subscribe((settings) => (this.settings = settings));

    this.grid.updatedNode$.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe((node) => {
      if (node) {
        if (node.type === NodeType.START) {
          this.gridService.fillPixel(node.x, node.y, '#1565C0');
        } else if (node.type === NodeType.TARGET) {
          this.gridService.fillPixel(node.x, node.y, '#1565C0');
        } else if (node.type === NodeType.WALL) {
          this.gridService.fillPixel(node.x, node.y, 'black');
        } else {
          this.gridService.clearPixel(node.x, node.y);
        }
      }
    });
  }

  ngAfterViewInit() {
    this.width = this.host.nativeElement.clientWidth;
    this.height = this.host.nativeElement.clientHeight - 64;
    this.xNodes = Math.floor(this.width / this.nodeSize);
    this.yNodes = Math.floor(this.height / this.nodeSize);

    this.grid.generateNodes(this.xNodes, this.yNodes, this.nodeSize);
    this.changeDetector.detectChanges();
  }

  ngAfterViewChecked() {
    const { x: startX, y: startY } = this.grid.startNode;
    const { x: targetX, y: targetY } = this.grid.targetNode;

    this.gridService.fillPixel(startX, startY, '#1565C0');
    this.gridService.fillPixel(targetX, targetY, '#1565C0');
  }

  onSettingsChanged(changes: Partial<Settings>) {
    this.settings = { ...this.settings, ...changes };
  }

  onGenerateMaze(mazeId: string) {
    //this.gridComponent.generateMaze(mazeId);
  }

  async visualizePath() {
    this.disableMouse();
    this.grid.resetPath();
    this.gridComponent.resetPixels(({ x, y }) => {
      return this.grid.getNode(x, y).type === NodeType.WALL;
    });

    const { algorithmId, delay, operationsPerSecond } = this.settings;
    const { path, operations } = this.grid.findPath(algorithmId);
    console.log(path);

    await this.renderOperations(operations, delay, operationsPerSecond);
    await this.renderPath(path);

    this.enableMouse();
  }

  async renderPath(path: number[][], delay?: number) {
    for (const [x, y] of path) {
      this.gridService.fillPixel(x, y, '#1565C0');

      /*if (delay) {
        await this.delay(5);
      }*/
    }
  }

  async renderOperations(operations: AlgorithmOperation[], delay?: number, operationsPerSecond?: number) {
    for (const { x, y, status } of operations) {
      this.gridService.fillPixel(x, y, '#64B5F6');
    }
  }

  onMouseDown({ x, y }: Pixel) {
    const node = this.grid.getNode(x, y);
    if (this.isNodeStartOrTargetPoint(node)) {
      this.draggedNode = { x: node.x, y: node.y };
      return;
    }

    this.updateNodeType(node);
  }

  onMouseMove({ x, y }: Pixel) {
    const node = this.grid.getNode(x, y);
    if (!node) {
      return;
    }

    if (this.draggedNode) {
      // this.renderRect(node.x, node.y, '#1565C0');
      // this.render();
      return;
    }

    if (this.isNodeStartOrTargetPoint(node)) {
      return;
    }

    this.updateNodeType(node);
  }

  onMouseUp({ x, y }: Pixel) {
    if (this.isMouseEnabled) {
      if (this.draggedNode) {
        const newNode = this.grid.getNode(x, y);
        const previouseNode = this.grid.getNode(this.draggedNode.x, this.draggedNode.y);

        newNode.type = previouseNode.type;
        previouseNode.type = NodeType.DEFAULT;

        if (newNode.type === NodeType.START) {
          this.grid.setStartNode(newNode);
        } else if (newNode.type === NodeType.TARGET) {
          this.grid.setTargetNode(newNode);
        }

        this.draggedNode = undefined;
        // this.resetPath();
      }

      this.paintingMode = PaintingMode.CREATE;
    }
  }

  onContextMenu({ x, y }: Pixel) {
    if (this.isMouseEnabled) {
      const node = this.grid.getNodeAt(x, y);
      if (this.isNodeStartOrTargetPoint(node)) {
        return;
      }

      this.paintingMode = PaintingMode.ERASE;
      this.updateNodeType(node);
    }
  }

  /*private renderIcon(x: number, y: number, scale: number, icon: any, color = 'white') {
    this.gridComponent.renderingContext.save();
    this.gridComponent.renderingContext.translate(x + 3.5, y + 3.5);
    this.gridComponent.renderingContext.fillStyle = color;
    this.gridComponent.renderingContext.scale(scale, scale);
    this.gridComponent.renderingContext.fill(new Path2D(icon));
    this.gridComponent.renderingContext.restore();

    this.gridService.render();
  }*/

  private isNodeStartOrTargetPoint(node: Node) {
    return node.type === NodeType.START || node.type === NodeType.TARGET;
  }

  private updateNodeType(node: Node) {
    const type = this.paintingMode === PaintingMode.CREATE ? NodeType.WALL : NodeType.DEFAULT;

    this.grid.updateNode(node.x, node.y, { type, isPath: false });
    // node = { ...node, ...{ type, isPath: false } };
  }

  private enableMouse() {
    this.isMouseEnabled = true;
  }

  private disableMouse() {
    this.isMouseEnabled = false;
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
