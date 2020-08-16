import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Node, PaintingMode } from 'src/app/models';
import { PaintingService } from 'src/app/services';

@Component({
  selector: 'node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss'],
})
export class NodeComponent implements OnInit {
  @Input() node: Node;


  constructor(private paintingService: PaintingService) {}

  ngOnInit() {
  }

  onClick() {
    this.node.isWall = this.paintingService.mode === PaintingMode.CREATE;
  }

  onMouseOver() {
    if (this.paintingService.isMousePressed) {
      this.node.isWall = this.paintingService.mode === PaintingMode.CREATE;
    }
  }
}
