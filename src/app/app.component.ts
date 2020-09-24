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
import { distinctUntilChanged, take, takeUntil } from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';
import { AlgorithmOperation, Node, NodeCoordinates, NodeType, PaintingMode, Pixel, Settings } from './models';
import { DrawingGridService, SettingsService } from './services';
import { GridComponent } from './components';
import { Grid } from './pathfinding';

const pathColor = '#1565C0';
const wallColor = 'black';

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
  visualizing$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  draggedNode: NodeCoordinates;
  hoveringNode: NodeCoordinates;

  isStartAndTargetInitialized = false;
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
        this.renderNode(node);
      }
    });
  }

  ngAfterViewInit() {
    this.width = this.host.nativeElement.clientWidth;
    this.height = this.host.nativeElement.clientHeight - 64;
    this.xNodes = Math.floor(this.width / this.nodeSize);
    this.yNodes = Math.floor(this.height / this.nodeSize) - 1;

    this.grid.generateNodes(this.xNodes, this.yNodes, this.nodeSize);
    this.changeDetector.detectChanges();
  }

  ngAfterViewChecked() {
    if (!this.isStartAndTargetInitialized) {
      const { x: startX, y: startY } = this.grid.startNode;
      const { x: targetX, y: targetY } = this.grid.targetNode;
      this.renderStartOrTargetNode(startX, startY, NodeType.START);
      this.renderStartOrTargetNode(targetX, targetY, NodeType.TARGET);

      this.isStartAndTargetInitialized = true;
    }
  }

  generateMaze(mazeId: string) {
    this.resetEverything();
    this.grid.generateMaze(mazeId);
  }

  async visualizePath() {
    this.visualizing$.next(true);
    this.disableMouse();
    this.resetPath();

    const { algorithmId, delay, operationsPerSecond } = this.settings;
    const { path, operations } = this.grid.findPath(algorithmId);

    await this.renderOperations(operations, delay, operationsPerSecond);
    await this.renderPath(path);

    this.enableMouse();
    this.visualizing$.next(false);
  }

  async renderPath(path: number[][]) {
    for (const [x, y] of path) {
      this.gridService.fillPixel(x, y, '#1565C0');
      await this.delay(50);
    }
  }

  async renderOperations(operations: AlgorithmOperation[], delay?: number, operationsPerSecond?: number) {
    for (const { x, y } of operations) {
      this.gridService.fillPixel(x, y, '#64B5F6');
      await this.delay(delay / operationsPerSecond);
    }
  }

  onMouseDown({ x, y }: Pixel) {
    const node = this.grid.getNode(x, y);
    if (this.isNodeStartOrTargetPoint(node)) {
      this.gridService.releaseMouse();
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
      this.renderStartOrTargetNode(x, y, node.type);

      if (this.hoveringNode) {
        this.gridService.clearPixel(this.hoveringNode.x, this.hoveringNode.y);
      }

      this.hoveringNode = node;
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

        this.updateNodeType(newNode, previouseNode.type);
        this.updateNodeType(previouseNode, NodeType.DEFAULT);

        if (previouseNode.type === NodeType.START) {
          this.grid.setStartNode(newNode);
        } else if (previouseNode.type === NodeType.TARGET) {
          this.grid.setTargetNode(newNode);
        }

        this.draggedNode = undefined;
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

  resetEverything() {
    this.grid.resetNodes(({ type }) => ({
      type: type === NodeType.START || type === NodeType.TARGET ? type : NodeType.DEFAULT,
    }));
  }

  resetWalls() {
    this.grid.resetNodes(({ type, isPath, status }) => ({
      type: type === NodeType.WALL ? NodeType.DEFAULT : type,
      isPath,
      status,
    }));
  }

  resetPath() {
    this.grid.resetNodes(() => ({
      isPath: false,
    }));
  }

  private renderNode(node: Node) {
    if (node.type === NodeType.START || node.type === NodeType.TARGET) {
      //   this.renderStartOrTargetNode(node.x, node.y, node.type);
    } else if (node.type === NodeType.WALL) {
      this.gridService.fillPixel(node.x, node.y, wallColor);
    } else if (node.type === NodeType.DEFAULT) {
      this.gridService.clearPixel(node.x, node.y);
    }
  }

  private renderStartOrTargetNode(x: number, y: number, type: NodeType) {
    this.gridService.renderPixel(x, y, {
      fillStyle: pathColor,
      icon: {
        svg:
          type === NodeType.START
            ? 'M24 4c-7.73 0-14 6.27-14 14 0 10.5 14 26 14 26s14-15.5 14-26c0-7.73-6.27-14-14-14zm0 19c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z'
            : 'M28.8 12L28 8H10v34h4V28h11.2l.8 4h14V12z',
        fillStyle: 'white',
        scale: 0.4,
      },
    });
  }

  private isNodeStartOrTargetPoint(node: Node) {
    return node.type === NodeType.START || node.type === NodeType.TARGET;
  }

  private updateNodeType(node: Node, type?: NodeType) {
    const newType = type ? type : this.paintingMode === PaintingMode.CREATE ? NodeType.WALL : NodeType.DEFAULT;
    if (node.type !== newType) {
      this.grid.updateNode(node.x, node.y, {
        type: newType,
        isPath: false,
        status: undefined,
      });
    }
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
