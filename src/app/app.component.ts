import { Component, ElementRef, AfterViewInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Node, NodeCoordinates, NodeType, PaintingMode, Pixel, Settings } from './models';
import { GridComponent } from './components';
import { Grid } from './pathfinding';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild(GridComponent) gridComponent: GridComponent;

  settings: Settings = {
    algorithmId: 'astar',
    mazeId: 'nomaze',
    operationsPerSecond: 250,
  };

  grid: Grid;

  width: number;
  height: number;
  xNodes: number;
  yNodes: number;
  nodeSize = 28;
  visualizing: boolean;

  draggedNode: NodeCoordinates;
  hoveringNode: NodeCoordinates;

  isMouseEnabled = true;
  paintingMode: PaintingMode;

  constructor(private host: ElementRef, private changeDetector: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.width = this.host.nativeElement.clientWidth;
    this.height = this.host.nativeElement.clientHeight;
    this.xNodes = Math.floor(this.width / this.nodeSize);
    this.yNodes = Math.floor(this.height / this.nodeSize);

    this.grid = new Grid(this.xNodes, this.yNodes, this.nodeSize);
    this.grid.build();

    this.changeDetector.detectChanges();
  }

  onSettingsChanged(changes: Partial<Settings>) {
    this.settings = { ...this.settings, ...changes };
  }

  onGenerateMaze(mazeId: string) {
    //this.gridComponent.generateMaze(mazeId);
  }

  async visualizePath() {
    this.visualizing = true;
    // await this.gridComponent.visualizePath(this.settings.algorithmId, this.settings.operationsPerSecond);
    this.visualizing = false;
  }

  onMouseDown({ x, y }: Pixel) {
    const node = this.grid.getNode(x, y);
    if (this.isNodeStartOrTargetPoint(node)) {
      this.draggedNode = { x: node.x, y: node.y };
      return;
    }

    this.updateNodeType(node, this.paintingMode === PaintingMode.CREATE ? NodeType.WALL : NodeType.DEFAULT);
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

    this.updateNodeType(node, this.paintingMode === PaintingMode.CREATE ? NodeType.WALL : NodeType.DEFAULT);
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
        this.resetPath();
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
      this.updateNodeType(node, NodeType.DEFAULT);
    }
  }

  private isNodeStartOrTargetPoint(node: Node) {
    return node.type === NodeType.START || node.type === NodeType.TARGET;
  }

  private updateNodeType(node: Node, type: NodeType) {
    node.type = type;
    node.isPath = false;
    this.gridComponent.fillPixel(node.x, node.y, 'black');
  }

  resetPath() {
    // this.gridComponent.resetPath();
  }

  resetWalls() {
    // this.gridComponent.resetWalls();
  }

  reset() {
    //   this.gridComponent.reset();
  }
}
