import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  HostBinding,
  AfterViewInit,
} from '@angular/core';
import { Node, NodeDroppedEvent, PaintingMode, NodeType } from 'src/app/models';
import { PaintingService, NodeDraggingService } from 'src/app/services';

@Component({
  selector: 'node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NodeComponent implements AfterViewInit {
  @Input() node: Node;
  @Input() isMouseEnabled: boolean;
  @Output() dropped: EventEmitter<NodeDroppedEvent> = new EventEmitter<NodeDroppedEvent>();

  @HostBinding('class.no-border') noBorder = true;

  constructor(
    private changeDetection: ChangeDetectorRef,
    private nodeDraggingService: NodeDraggingService,
    private paintingService: PaintingService
  ) {}

  ngAfterViewInit() {
    // this.changeDetection.detach();
  }

  onMouseDown(event: MouseEvent) {
    if (this.isMouseEnabled) {
      if (this.isStartNode || this.isTargetNode) {
        event.stopPropagation();
        this.paintingService.releaseMouse();
        return;
      }

      this.paintNode();
    }
  }

  onMouseOver() {
    if (this.isMouseEnabled) {
      if (this.paintingService.isMouseLocked && !this.isStartNode && !this.isTargetNode) {
        this.paintNode();
      }
    }
  }

  paintNode() {
    this.node.type = this.paintingService.mode === PaintingMode.CREATE ? NodeType.WALL : NodeType.DEFAULT;
    this.node.isPath = false;
    this.changeDetection.detectChanges();
  }

  onContextMenu(event: MouseEvent) {
    if (this.isMouseEnabled) {
      event.preventDefault();

      if (this.isStartNode || this.isTargetNode) {
        return;
      }

      this.paintingService.updateMode(PaintingMode.ERASE);
      this.node.type = NodeType.DEFAULT;
      this.changeDetection.detectChanges();
    }
  }

  onMouseUp() {
    if (this.isMouseEnabled) {
      this.paintingService.updateMode(PaintingMode.CREATE);
    }
  }

  onDragStart() {
    if (this.isMouseEnabled) {
      this.nodeDraggingService.setNode(this.node);
    }
  }

  onDrop() {
    if (this.isMouseEnabled) {
      this.dropped.emit({
        previousNode: this.nodeDraggingService.node,
        newNode: this.node,
      });
    }
  }

  preventDefault(event: DragEvent) {
    if (this.isMouseEnabled) {
      event.preventDefault();
    }
  }

  markForCheck() {
    this.changeDetection.markForCheck();
  }

  detectChanges() {
    this.changeDetection.detectChanges();
  }

  get classes() {
    return {
      wall: this.isWall,
      path: !this.isWall && this.isPath,
      opened: this.isOpened,
      closed: this.isClosed,
    };
  }

  get isWall() {
    return this.node.type === NodeType.WALL;
  }

  get isPath() {
    return this.node.isPath;
  }

  get isOpened() {
    return this.node.status === 'opened';
  }

  get isClosed() {
    return this.node.status === 'closed';
  }

  get isStartNode() {
    return this.node.type === NodeType.START;
  }

  get isTargetNode() {
    return this.node.type === NodeType.TARGET;
  }
}
