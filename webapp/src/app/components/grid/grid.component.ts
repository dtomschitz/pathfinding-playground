import { Component, Input, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Node, NodeType, Grid } from '../../models';
import { BoardActions } from '../../store/actions';

import * as fromRoot from '../../store/reducers';

@Component({
  selector: 'grid',
  templateUrl: './grid.component.html',
})
export class GridComponent implements OnInit {
  @Input() height: number;
  @Input() width: number;

  grid$: Observable<Grid>;

  constructor(private store: Store<fromRoot.State>) {
    this.grid$ = this.store.pipe(select(fromRoot.selectGrid));
  }

  ngOnInit() {
    this.store.dispatch(BoardActions.generateGrid({ height: this.height, width: this.width }));
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
