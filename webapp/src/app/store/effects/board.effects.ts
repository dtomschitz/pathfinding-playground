import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { Node, Dimension, NodeType } from '../../models';
import { BoardActions } from '../actions';

@Injectable()
export class GridEffects {
  generateGrid$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardActions.generateGrid),
      map((dimension) => {
        const grid: Node[][] = [];

        for (let row = 0; row < dimension.height; row++) {
          const columns: Node[] = [];
          for (let column = 0; column < dimension.width; column++) {
            columns.push({
              id: `${row}-${column}`,
              row,
              column,
              type: this.getNodeType(row, column, dimension),
            });
          }
          grid.push(columns);
        }

        return BoardActions.updateGrid({ grid });
      })
    )
  );

  constructor(private actions$: Actions) {}

  getNodeType(row: number, column: number, { height, width }: Dimension) {
    if (row === Math.floor(height / 2) && column === Math.floor(width / 4)) {
      return NodeType.START;
    } else if (row === Math.floor(height / 2) && column === Math.floor((3 * width) / 4)) {
      return NodeType.TARGET;
    }

    return NodeType.DEFAULT;
  }
}
