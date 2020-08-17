import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Node, NodeDroppedEvent, PaintingMode, NodeType } from 'src/app/models';
import { PaintingService, NodeDraggingService } from 'src/app/services';

@Component({
  selector: 'node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NodeComponent {
  @Input() node: Node;
  @Output() dropped: EventEmitter<NodeDroppedEvent> = new EventEmitter<NodeDroppedEvent>();

  constructor(
    private changeDetection: ChangeDetectorRef,
    private nodeDraggingService: NodeDraggingService,
    private paintingService: PaintingService
  ) {}

  onMouseDown(event: MouseEvent) {
    console.log('down', event);

    if (this.isStartNode || this.isTargetNode) {
      event.stopPropagation();
      this.paintingService.releaseMouse();
      return;
    }

    this.node.type = this.paintingService.mode === PaintingMode.CREATE ? NodeType.WALL : NodeType.DEFAULT;
  }

  onMouseOver() {
    if (this.paintingService.isMouseLocked && !this.isStartNode && !this.isTargetNode) {
      this.node.type = this.paintingService.mode === PaintingMode.CREATE ? NodeType.WALL : NodeType.DEFAULT;
    }
  }

  onContextMenu(event: MouseEvent) {
    event.preventDefault();

    if (this.isStartNode || this.isTargetNode) {
      return;
    }

    this.paintingService.mode = PaintingMode.ERASE;
    this.node.type = NodeType.DEFAULT;
  }

  onMouseUp() {
    this.paintingService.mode = PaintingMode.CREATE;
  }

  onDragStart() {
    this.nodeDraggingService.setNode(this.node);
  }

  onDragEnter(event: DragEvent) {
    event.preventDefault();
  }

  onDrop() {
    this.dropped.emit({
      previousNode: this.nodeDraggingService.node,
      newNode: this.node,
    });
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  markForCheck() {
    this.changeDetection.markForCheck();
  }

  get isWall() {
    return this.node.type === NodeType.WALL;
  }

  get isStartNode() {
    return this.node.type === NodeType.START;
  }

  get isTargetNode() {
    return this.node.type === NodeType.TARGET;
  }
}
