import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Node } from 'src/app/models';
import { NodeType } from 'src/app/models/node-type';

@Component({
  selector: 'grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements AfterViewInit {
  height: number;
  width: number;

  nodes: Node[][];

  ngAfterViewInit() {}

  createGrid() {
    for (let row = 0; row < this.height; row++) {
      const columns: Node[] = [];
      for (let column = 0; column < this.width; column++) {
        columns.push({
          id: `${row}-${column}`,
          row,
          column,
          type: this.getNodeType(row, column),
        });
      }
      this.nodes.push(columns);
    }
  }

  getNodeType(row: number, column: number) {
    if (row === Math.floor(this.height / 2) && column === Math.floor(this.width / 4)) {
      return NodeType.START;
    } else if (row === Math.floor(this.height / 2) && column === Math.floor((3 * this.width) / 4)) {
      return NodeType.TARGET;
    }

    return NodeType.DEFAULT;
  }
}
