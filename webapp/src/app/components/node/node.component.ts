import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Node } from 'src/app/models';

@Component({
  selector: 'node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss'],
})
export class NodeComponent implements OnInit {
  @Input() node: Node;
  @Output() selectionChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit(): void {}

  onClick() {
    this.selectionChange.emit(!this.node.isWall);
  }
}
