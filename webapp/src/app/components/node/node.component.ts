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

  isStartNodePreview: boolean;
  isTargetNodePreview: boolean;

  constructor(
    private changeDetection: ChangeDetectorRef,
    private nodeDraggingService: NodeDraggingService,
    private paintingService: PaintingService
  ) {}

  onMouseDown(event: MouseEvent) {
    if (this.isStartNode || this.isTargetNode) {
      this.paintingService.releaseMouse();
      event.stopPropagation();
      return;
    }

    this.node.isWall = this.paintingService.mode === PaintingMode.CREATE;
  }

  onMouseUp(event: MouseEvent) {}

  createWall() {
    if (this.paintingService.isMouseLocked && !this.isStartNode && !this.isTargetNode) {
      this.node.isWall = this.paintingService.mode === PaintingMode.CREATE;
    }
  }

  onDragStart(event: DragEvent) {
    this.nodeDraggingService.setNode(this.node);
    console.log('D');
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
    return this.node.isWall;
  }

  get isStartNode() {
    return this.node.type === NodeType.START;
  }

  get isTargetNode() {
    return this.node.type === NodeType.TARGET;
  }
}
