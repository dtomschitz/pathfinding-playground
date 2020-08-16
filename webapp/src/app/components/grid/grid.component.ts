import { Component, Input, OnInit, AfterViewChecked, OnChanges, SimpleChanges } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { NodeType, Grid, Node } from '../../models';
import { BoardActions } from '../../store/actions';

import * as fromRoot from '../../store/reducers';
import { PaintingService } from 'src/app/services';

@Component({
  selector: 'grid',
  templateUrl: './grid.component.html',
})
export class GridComponent implements OnInit {
  @Input() height: number;
  @Input() width: number;

  grid: Grid = [];

  constructor(private store: Store<fromRoot.State>, private mouseService: PaintingService) {
    //this.grid$ = this.store.pipe(select(fromRoot.selectGrid));
  }

  ngOnInit() {
    this.createGrid();
    // this.store.dispatch(BoardActions.generateGrid({ height: this.height, width: this.width }));
  }

  onMouseDown(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.mouseService.click();
  }

  onMouseUp(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.mouseService.release();
  }

  createGrid() {
    for (let row = 0; row < this.height; row++) {
      const columns: Node[] = [];
      for (let column = 0; column < this.width; column++) {
        columns.push({
          id: `${row}-${column}`,
          row,
          column,
          type: this.getNodeType(row, column),
          isWall: false,
        });
      }
      this.grid.push(columns);
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
